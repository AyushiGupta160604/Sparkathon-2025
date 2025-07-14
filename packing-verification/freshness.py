import torch
from PIL import Image
import numpy as np
import io

# Load the model once when the module is imported
model_path = 'C:\\Users\\Mayank bharti\\Documents\\GitHub\\sparkthon-25\\packing-verification\\model_final1'
model = torch.load(model_path, map_location=torch.device('cpu'), weights_only=False)
model.eval()

class_labels = [
    'Apple(1-5)', 'Apple(10-14)', 'Apple(5-10)',
    'Banana(1-5)', 'Banana(10-15)', 'Banana(15-20)', 'Banana(5-10)',
    'Carrot(1-2)', 'Carrot(3-4)', 'Expired',
    'Tomato(1-5)', 'Tomato(10-15)', 'Tomato(5-10)', 'Carrot(5-6)'
]

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    img = img.resize((224, 224))
    img = np.array(img).astype(np.float32) / 255.0
    img = np.transpose(img, (2, 0, 1))
    img = torch.tensor(img).unsqueeze(0)
    return img

def get_freshness_score(image_path):
    with open(image_path, 'rb') as f:
        img_bytes = f.read()

    img = preprocess_image(img_bytes)

    with torch.no_grad():
        outputs = model(img)
        _, predicted_class = torch.max(outputs, 1)

    prediction = class_labels[predicted_class.item()]

    # Convert freshness label to numerical score
    score = estimate_freshness_score(prediction)
    return score  # returns value like 80 for "Apple(1-5)"
    
def estimate_freshness_score(label):
    """
    Convert class label (e.g. Apple(1-5)) to score (e.g. 90).
    Fresher = Higher score. Expired = 0.
    """
    if "Expired" in label:
        return 0

    days = 10  # default if not parsed
    try:
        days_str = label.split('(')[-1].replace(')', '')  # e.g., "1-5"
        min_day = int(days_str.split('-')[0])
        days = min_day
    except:
        pass

    if days <= 2:
        return 95
    elif days <= 5:
        return 85
    elif days <= 10:
        return 70
    elif days <= 15:
        return 60
    else:
        return 40
