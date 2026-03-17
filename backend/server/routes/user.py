from fastapi import APIRouter
from database import users_collection
from passlib.hash import bcrypt

router = APIRouter()

@router.post("/register")
def register(user: dict):
    user["password"] = bcrypt.hash(user["password"])
    users_collection.insert_one(user)
    return {"message": "User registered"}

@router.post("/login")
def login(user: dict):
    db_user = users_collection.find_one({"email": user["email"]})

    if not db_user or not bcrypt.verify(user["password"], db_user["password"]):
        return {"error": "Invalid credentials"}

    return {"message": "Login success"}