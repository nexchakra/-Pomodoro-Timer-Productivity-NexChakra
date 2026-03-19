from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import task, session, analytics, user

app = FastAPI()


# 🌐 CORS (Frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 🚀 ROUTES (ONLY HERE PREFIX)
app.include_router(task.router, prefix="/tasks", tags=["Tasks"])
app.include_router(session.router, prefix="/sessions", tags=["Sessions"])
app.include_router(user.router, prefix="/auth", tags=["Auth"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])


# 🏠 Root
@app.get("/")
def home():
    return {"message": "API running 🚀"}