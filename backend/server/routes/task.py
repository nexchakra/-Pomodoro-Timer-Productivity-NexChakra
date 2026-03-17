from fastapi import APIRouter
from database import tasks_collection
from bson import ObjectId

router = APIRouter()

# ➕ Add task
@router.post("/")
def add_task(data: dict):
    tasks_collection.insert_one(data)
    return {"message": "Task added"}


# 📥 Get tasks
@router.get("/")
def get_tasks():
    tasks = list(tasks_collection.find())

    for task in tasks:
        task["_id"] = str(task["_id"])  # convert ObjectId → string

    return tasks


# ✅ Complete task
@router.put("/{id}")
def complete_task(id: str):
    tasks_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"completed": True}}
    )
    return {"message": "Task completed"}


# ✏️ Edit task
@router.put("/edit/{id}")
def edit_task(id: str, data: dict):
    tasks_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"title": data["title"]}}
    )
    return {"message": "Task updated"}


# ❌ Delete task
@router.delete("/{id}")
def delete_task(id: str):
    tasks_collection.delete_one({"_id": ObjectId(id)})
    return {"message": "Task deleted"}