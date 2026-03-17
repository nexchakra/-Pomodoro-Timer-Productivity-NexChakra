from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import task, session, analytics, user

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(task.router, prefix="/tasks")
app.include_router(session.router, prefix="/sessions")
app.include_router(user.router, prefix="/auth")
app.include_router(analytics.router, prefix="/analytics")


@app.get("/")
def home():
    return {"message": "API running"}