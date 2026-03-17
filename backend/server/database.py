from pymongo import MongoClient

# 🔥 Replace with your NEW password
MONGO_URI = "mongodb+srv://bibhashyadav:MSxXTgQln1d1KZXr@pomodoro.yyfkfto.mongodb.net/pomodoro_db?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)

db = client["pomodoro_db"]

users_collection = db["users"]
tasks_collection = db["tasks"]
sessions_collection = db["sessions"]