import uuid
from datetime import datetime
from sqlalchemy import Boolean, Column, String, Text, DateTime, Enum, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from database import Base
import enum


class FileType(str, enum.Enum):
    pdf = "pdf"
    video = "video"
    mp3 = "mp3"
    image = "image"
    website = "website"


class User(Base):
    __tablename__ = "users"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(100), nullable=False, unique=True, index=True)
    email = Column(String(255), nullable=True, unique=True, index=True)
    password_hash = Column(String(500), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Folder(Base):
    __tablename__ = "folders"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    parent_id = Column(Uuid(as_uuid=True), ForeignKey("folders.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    documents = relationship("Document", back_populates="folder")
    subfolders = relationship("Folder", backref="parent", remote_side=[id])


class Document(Base):
    __tablename__ = "documents"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    file_type = Column(Enum(FileType), nullable=False)
    cloudinary_url = Column(String(500), nullable=True)
    cloudinary_public_id = Column(String(255), nullable=True)
    drive_url = Column(String(500), nullable=True)
    folder_id = Column(Uuid(as_uuid=True), ForeignKey("folders.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    folder = relationship("Folder", back_populates="documents")
