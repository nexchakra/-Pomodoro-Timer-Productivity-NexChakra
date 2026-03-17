from fastapi import APIRouter
from database import sessions_collection

router = APIRouter()

@router.post("/")
def save_session(session: dict):
    sessions_collection.insert_one(session)
    return {"message": "Session saved"}

@router.get("/")
def get_sessions():
    return list(sessions_collection.find({}, {"_id": 0}))