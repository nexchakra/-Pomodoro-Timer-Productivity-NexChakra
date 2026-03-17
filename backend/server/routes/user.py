from fastapi import APIRouter, HTTPException
from database import users_collection
from passlib.context import CryptContext
from jose import jwt

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "secretkey"


@router.post("/register")
def register(user: dict):
    existing = users_collection.find_one({"email": user["email"]})

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    password = user["password"][:72]   # 🔥 VERY IMPORTANT
    hashed = pwd_context.hash(password)

    users_collection.insert_one({
        "name": user["name"],
        "email": user["email"],
        "password": hashed
    })

    return {"message": "User created successfully"}


@router.post("/login")
def login(user: dict):
    db_user = users_collection.find_one({"email": user["email"]})

    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    if not pwd_context.verify(user["password"][:72], db_user["password"]):
        raise HTTPException(status_code=401, detail="Wrong password")

    token = jwt.encode(
        {"user_id": str(db_user["_id"])},
        SECRET_KEY,
        algorithm="HS256"
    )

    return {"token": token
            , "name": db_user["name"]
            }