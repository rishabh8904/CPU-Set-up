import json
from pymongo import MongoClient
from dotenv import load_dotenv
import os


load_dotenv()
MONGO_URI = os.getenv('MONGO_URI')


if not MONGO_URI:
    print("FATAL ERROR: The MONGO_URI environment variable was not found.")
    print("Please check your .env file for the following:")
    print("1. Is the file named exactly '.env'?")
    print("2. Is it in the same folder as this script?")
    print("3. Does it contain the line: MONGO_URI='mongodb+srv://...'?")
    exit() 

try:
    client = MongoClient(MONGO_URI)
    client.admin.command('ping')
    print("Successfully connected to MongoDB Atlas!")
    db = client['pc-builder-db']
    components_collection = db['components']
except Exception as e:
    print(f"Failed to connect to MongoDB Atlas. Error: {e}")
    exit()

try:
    with open('components.json', 'r') as f:
        components_data = json.load(f)

    if not components_data:
        print("JSON file is empty. Nothing to seed.")
        exit()

    print(f"Found {len(components_data)} components in JSON file. Seeding database...")
    
    components_collection.delete_many({})
    print("Cleared existing data from the collection.")

    components_collection.insert_many(components_data)
    print(f"Successfully inserted {len(components_data)} components into the database.")

except FileNotFoundError:
    print("Error: components.json not found.")
except Exception as e:
    print(f"An error occurred during seeding: {e}")
finally:
    client.close()
    print("Database connection closed.")