from fastapi import APIRouter
from database import tasks_collection
import uuid

router = APIRouter()

# CREATE TASK
@router.post("/")
def create_task(task: dict):
    task["id"] = str(uuid.uuid4())
    task["completed"] = False
    tasks_collection.insert_one(task)
    return {"message": "Task created"}

# GET TASKS
@router.get("/")
def get_tasks():
    tasks = list(tasks_collection.find({}, {"_id": 0}))
    return tasks

# UPDATE TASK
@router.put("/{task_id}")
def update_task(task_id: str):
    tasks_collection.update_one(
        {"id": task_id},
        {"$set": {"completed": True}}
    )
    return {"message": "Task completed"}

# DELETE TASK
@router.delete("/{task_id}")
def delete_task(task_id: str):
    tasks_collection.delete_one({"id": task_id})
    return {"message": "Task deleted"}