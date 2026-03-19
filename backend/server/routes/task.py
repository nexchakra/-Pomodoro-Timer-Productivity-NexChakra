from fastapi import APIRouter
from database import tasks_collection
from bson import ObjectId

router = APIRouter()   # ❌ REMOVE prefix here


# ➕ Add task
@router.post("/")
def add_task(data: dict):
    tasks_collection.insert_one(data)
    return {"message": "Task added"}


# 📥 Get ALL tasks (optional)
@router.get("/all")
def get_all_tasks():
    tasks = list(tasks_collection.find())

    for task in tasks:
        task["_id"] = str(task["_id"])

    return tasks


# ✅ Get USER tasks
@router.get("/{user}")
def get_user_tasks(user: str):
    tasks = list(tasks_collection.find({"user": user}))

    for task in tasks:
        task["_id"] = str(task["_id"])

    return tasks


# ✅ Update (toggle complete)
@router.put("/{id}")
def update_task(id: str, data: dict):
    tasks_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )
    return {"message": "Task updated"}


# ✏️ Edit title
@router.put("/edit/{id}")
def edit_task(id: str, data: dict):
    tasks_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"title": data["title"]}}
    )
    return {"message": "Task updated"}


# ❌ Delete
@router.delete("/{id}")
def delete_task(id: str):
    tasks_collection.delete_one({"_id": ObjectId(id)})
    return {"message": "Task deleted"}