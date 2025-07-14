import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client['inventoryDB']
collection = db['inventory']

def get_expected_quantity(product_id):
    item = collection.find_one({"productId": product_id})
    return item["expectedQuantity"] if item else None

def save_inventory(product_id, product_name, expected_quantity):
    try:
        expected_quantity = int(expected_quantity)
    except Exception as e:
        # print("[ERROR] expected_quantity is not int:", expected_quantity)
        raise e

    # print("[PARSED NAME2]", product_name)
    # print("[PARSED QTY2]", expected_quantity)

    collection.update_one(
        {"productId": product_id},
        {"$set": {
            "productName": product_name,
            "expectedQuantity": expected_quantity
        }},
        upsert=True
    )

def delete_inventory(product_id):
    collection.delete_one({"productId": product_id})

def get_inventory_item(product_id):
    return collection.find_one({"productId": product_id})

