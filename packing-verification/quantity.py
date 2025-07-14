import os
import cv2
from ultralytics import YOLO

# Load the pretrained YOLOv8 model
model = YOLO('C:\\Users\\Mayank bharti\\Documents\\GitHub\\grid\\Backend\\yolov8n.pt')

def detect_quantity(image_path):
    """
    Performs YOLOv8 inference and returns detection info.

    Args:
        image_path (str): Path to the saved image file

    Returns:
        Tuple of (response_dict, status_code)
    """
    try:
        image = cv2.imread(image_path)
        results = model(image)

        detections = []
        object_counts = {}

        for result in results:
            for box in result.boxes:
                class_id = int(box.cls)
                class_name = model.names[class_id]
                confidence = float(box.conf[0])
                x1, y1, x2, y2 = map(int, box.xyxy[0])

                detections.append({
                    'class': class_name,
                    'confidence': confidence,
                    'box': [x1, y1, x2, y2]
                })

                object_counts[class_name] = object_counts.get(class_name, 0) + 1

        return {
            'detections': detections,
            'object_counts': object_counts
        }, 200

    except Exception as e:
        return {'error': str(e)}, 500
