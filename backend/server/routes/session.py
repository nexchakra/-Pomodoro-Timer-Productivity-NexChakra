from fastapi import APIRouter
from database import sessions_collection
from bson import ObjectId

router = APIRouter()

# ➕ Add session
@router.post("/")
def add_session(data: dict):
    sessions_collection.insert_one(data)
    return {"message": "Session saved"}


# 📥 Get all sessions
@router.get("/")
def get_sessions():
    sessions = list(sessions_collection.find({}, {"_id": 0}))
    return sessions


# ❌ Delete session (optional but useful)
@router.delete("/{id}")
def delete_session(id: str):
    sessions_collection.delete_one({"_id": ObjectId(id)})
    return {"message": "Session deleted"}