import mediapipe as mp
import numpy as np
import cv2

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
        # Convert uploaded file → numpy array
        file_bytes = np.frombuffer(image_file.read(), np.uint8)
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        # Convert to MediaPipe format
        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=image
        )

        # Run detection
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