import mediapipe as mp
import numpy as np
import cv2
import tempfile
import os
import math
import requests as http_requests

BaseOptions = mp.tasks.BaseOptions
PoseLandmarker = mp.tasks.vision.PoseLandmarker
PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode


class PoseService:
    def __init__(self):
        options = PoseLandmarkerOptions(
            base_options=BaseOptions(
                model_asset_path="pose_landmarker.task"
            ),
            running_mode=VisionRunningMode.IMAGE
        )

        self.landmarker = PoseLandmarker.create_from_options(options)

    def process_image(self, image_file):
        file_bytes = np.frombuffer(image_file.read(), np.uint8)
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=image
        )

        result = self.landmarker.detect(mp_image)

        return self.format_result(result)

    def format_result(self, result):
        landmarks = []

        if result.pose_landmarks:
            for lm in result.pose_landmarks[0]:
                landmarks.append({
                    "x": lm.x,
                    "y": lm.y,
                    "z": lm.z
                })

        return {"landmarks": landmarks}
    

class VideoPoseService:
    def __init__(self):
        self.landmarks_per_frame = []

        options = PoseLandmarkerOptions(
            base_options=BaseOptions(model_asset_path="pose_landmarker.task"),
            running_mode=VisionRunningMode.VIDEO
        )
        self.landmarker = PoseLandmarker.create_from_options(options)

    def process_video(self, video_file):
        self.landmarks_per_frame = []

        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
            tmp.write(video_file.read())
            video_path = tmp.name

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError(f"Cannot open video file: {video_path}")
        frame_num = 0
        fps = cap.get(cv2.CAP_PROP_FPS) or 30  #

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            mp_image = mp.Image(
                image_format=mp.ImageFormat.SRGB,
                data=frame
            )

            result = self.landmarker.detect_for_video(mp_image, timestamp_ms=int(frame_num * (1000 / fps)))
            
            frame_landmarks = []
            if result.pose_landmarks:
                for lm in result.pose_landmarks[0]:
                    frame_landmarks.append({"x": lm.x, "y": lm.y, "z": lm.z})

            timestamp_ms = int(frame_num * (1000 / fps))
            self.landmarks_per_frame.append({
                "timestamp_ms": timestamp_ms,
                "landmarks": frame_landmarks
            })

            frame_num += 1

        cap.release()
        os.remove(video_path)

        return {"frames": self.landmarks_per_frame}


# --- Pose Comparison Utilities ---

KEY_JOINTS = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]
KEY_ANGLES = [
    (11, 13, 15), (12, 14, 16),  # elbows
    (23, 25, 27), (24, 26, 28),  # knees
    (11, 23, 25), (12, 24, 26),  # torso
]


def _normalize_landmarks(landmarks):
    """Normalize landmarks to bounding box."""
    if not landmarks:
        return landmarks
    xs = [lm['x'] for lm in landmarks]
    ys = [lm['y'] for lm in landmarks]
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    w = max_x - min_x or 1
    h = max_y - min_y or 1
    return [{'x': (lm['x'] - min_x) / w, 'y': (lm['y'] - min_y) / h, 'z': lm['z'] / w} for lm in landmarks]


def _calc_angle(a, b, c):
    radians = math.atan2(c['y'] - b['y'], c['x'] - b['x']) - math.atan2(a['y'] - b['y'], a['x'] - b['x'])
    angle = abs(math.degrees(radians))
    return angle if angle <= 180 else 360 - angle


def _compare_frames(inst_lm, stud_lm):
    """Compare two frames, return score 0-100."""
    if not inst_lm or not stud_lm:
        return 0
    inst = _normalize_landmarks(inst_lm)
    stud = _normalize_landmarks(stud_lm)
    n = min(len(inst), len(stud))

    # Landmark distance score
    total_dist = 0
    count = 0
    for i in range(n):
        dx = inst[i]['x'] - stud[i]['x']
        dy = inst[i]['y'] - stud[i]['y']
        dz = inst[i]['z'] - stud[i]['z']
        total_dist += math.sqrt(dx*dx + dy*dy + dz*dz)
        count += 1
    avg_dist = total_dist / count if count else 1
    landmark_score = max(0, 100 * (1 - avg_dist))

    # Angle score
    angle_diffs = []
    for a, b, c in KEY_ANGLES:
        if a < n and b < n and c < n:
            inst_angle = _calc_angle(inst[a], inst[b], inst[c])
            stud_angle = _calc_angle(stud[a], stud[b], stud[c])
            diff = abs(inst_angle - stud_angle)
            diff = min(diff, 360 - diff)
            angle_diffs.append(diff)
    avg_angle = sum(angle_diffs) / len(angle_diffs) if angle_diffs else 90
    angle_score = max(0, 100 * (1 - avg_angle / 180))

    return landmark_score * 0.5 + angle_score * 0.5


def _dtw_compare(inst_frames, stud_frames, sample_step=3):
    """DTW comparison between two frame sequences. Returns score 0-100."""
    # Sample frames to reduce computation
    seq1 = [f['landmarks'] for f in inst_frames[::sample_step] if f['landmarks']]
    seq2 = [f['landmarks'] for f in stud_frames[::sample_step] if f['landmarks']]

    if not seq1 or not seq2:
        return 0

    n, m = len(seq1), len(seq2)
    # Standard DTW
    dtw = np.full((n + 1, m + 1), np.inf)
    dtw[0][0] = 0

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = 100 - _compare_frames(seq1[i-1], seq2[j-1])
            dtw[i][j] = cost + min(dtw[i-1][j], dtw[i][j-1], dtw[i-1][j-1])

    # Backtrack for frame scores
    path = []
    i, j = n, m
    while i > 0 and j > 0:
        path.append((i-1, j-1))
        vals = [dtw[i-1][j-1], dtw[i-1][j], dtw[i][j-1]]
        idx = np.argmin(vals)
        if idx == 0:
            i -= 1; j -= 1
        elif idx == 1:
            i -= 1
        else:
            j -= 1

    frame_scores = [_compare_frames(seq1[i], seq2[j]) for i, j in path]
    avg_score = sum(frame_scores) / len(frame_scores) if frame_scores else 0

    return round(avg_score, 1)


def _download_video(url):
    """Download video from URL to temp file."""
    resp = http_requests.get(url, stream=True, timeout=30)
    resp.raise_for_status()
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    for chunk in resp.iter_content(8192):
        tmp.write(chunk)
    tmp.close()
    return tmp.name


def compare_videos(reference_url, submission_url):
    """Compare two videos and return a suggested score 0-100."""
    service1 = VideoPoseService()
    service2 = VideoPoseService()

    ref_path = _download_video(reference_url)
    sub_path = _download_video(submission_url)

    try:
        with open(ref_path, 'rb') as f:
            ref_result = service1.process_video(f)
        with open(sub_path, 'rb') as f:
            sub_result = service2.process_video(f)
    finally:
        os.remove(ref_path)
        os.remove(sub_path)

    ref_frames = ref_result['frames']
    sub_frames = sub_result['frames']

    if not ref_frames or not sub_frames:
        return {'score': 0, 'error': 'Could not detect poses in one or both videos'}

    score = _dtw_compare(ref_frames, sub_frames)
    return {'score': score}