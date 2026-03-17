from fastapi import APIRouter
from database import sessions_collection

router = APIRouter()

@router.get("/analytics")
def get_analytics():
    sessions = list(sessions_collection.find({}))

    total_sessions = len(sessions)
    total_focus_time = sum(s["duration"] for s in sessions if s["type"] == "focus")

    return {
        "total_sessions": total_sessions,
        "total_focus_time": total_focus_time
    }