from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from database import engine
import models

models.Base.metadata.create_all(bind=engine)

from routes import auth, documents, drive, folders

app = FastAPI(
    title="BE Document Manager API",
    description="API quản lý tài liệu PDF, Video, MP3",
    version="1.0.0",
)

allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
allowed_origins = [o.strip() for o in allowed_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(drive.router)
app.include_router(folders.router)


@app.get("/")
def root():
    return {"message": "BE Document Manager API is running 🚀"}


@app.get("/health")
def health():
    return {"status": "ok"}
