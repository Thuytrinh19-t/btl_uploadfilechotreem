from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from models import FileType


class DocumentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    file_type: FileType
    cloudinary_url: Optional[str] = None
    cloudinary_public_id: Optional[str] = None
    drive_url: Optional[str] = None
    folder_id: Optional[UUID] = None


class FolderCreate(BaseModel):
    name: str
    parent_id: Optional[UUID] = None


class FolderUpdate(BaseModel):
    name: Optional[str] = None


class FolderResponse(BaseModel):
    id: UUID
    name: str
    parent_id: Optional[UUID]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    folder_id: Optional[UUID] = None


class DocumentResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    file_type: FileType
    cloudinary_url: Optional[str]
    cloudinary_public_id: Optional[str]
    drive_url: Optional[str]
    folder_id: Optional[UUID]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DriveImportRequest(BaseModel):
    url: str
    title: str
    description: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    password: str
    email: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
