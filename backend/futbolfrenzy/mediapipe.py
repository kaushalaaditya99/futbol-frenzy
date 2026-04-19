import mediapipe as mp
import numpy as np
import cv2
import tempfile
import os

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