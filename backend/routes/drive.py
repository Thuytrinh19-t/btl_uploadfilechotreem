import re
import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
from schemas import DriveImportRequest, DocumentResponse, DocumentCreate
from typing import List, Optional
from uuid import UUID
import crud
from utils.cloudinary_utils import upload_from_url

router = APIRouter(prefix="/documents/drive", tags=["drive"], dependencies=[Depends(get_current_user)])


def convert_drive_url_to_direct(url: str) -> tuple[str, str]:
    """Convert Google Drive share URL to direct download URL and detect file type."""
    # Extract file ID from various Drive URL formats
    patterns = [
        r"/file/d/([a-zA-Z0-9_-]+)",
        r"id=([a-zA-Z0-9_-]+)",
    ]
    file_id = None
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            file_id = match.group(1)
            break

    if not file_id:
        raise ValueError("Cannot extract file ID from Google Drive URL")

    direct_url = f"https://drive.google.com/uc?export=download&id={file_id}&confirm=t"
    return direct_url, file_id


def convert_drive_folder_url_to_id(url: str) -> str:
    """Extract folder ID from Google Drive folder share URL."""
    patterns = [
        r"/folders/([a-zA-Z0-9_-]+)",
        r"id=([a-zA-Z0-9_-]+)",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    raise ValueError("Cannot extract folder ID from Google Drive URL")


def detect_file_type_from_url(filename: str) -> str:
    ext = filename.lower().split(".")[-1] if "." in filename else ""
    if ext == "pdf":
        return "pdf"
    elif ext in ("mp4", "mov", "avi", "mkv", "webm"):
        return "video"
    elif ext in ("mp3", "wav", "ogg", "aac", "flac"):
        return "mp3"
    elif ext in ("jpg", "jpeg", "png", "gif", "webp", "svg"):
        return "image"
    return "pdf"  # default


@router.post("/import", response_model=DocumentResponse)
async def import_from_drive(request: DriveImportRequest, folder_id: Optional[UUID] = None, db: Session = Depends(get_db)):
    try:
        direct_url, file_id = convert_drive_url_to_direct(request.url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Follow redirect to get actual filename
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=30) as client:
            head_response = await client.head(direct_url)
            content_disposition = head_response.headers.get("content-disposition", "")
            content_type = head_response.headers.get("content-type", "")
    except Exception:
        content_disposition = ""
        content_type = ""

    # Detect file type from content-type or default
    if "pdf" in content_type:
        file_type = "pdf"
    elif "video" in content_type:
        file_type = "video"
    elif "audio" in content_type:
        file_type = "mp3"
    elif "image" in content_type:
        file_type = "image"
    else:
        file_type = "pdf"

    try:
        result = upload_from_url(direct_url, file_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload to Cloudinary: {str(e)}")

    doc_data = DocumentCreate(
        title=request.title,
        description=request.description,
        file_type=file_type,
        cloudinary_url=result["url"],
        cloudinary_public_id=result["public_id"],
        drive_url=request.url,
        folder_id=folder_id
    )
    return crud.create_document(db, doc_data)


@router.post("/import-folder")
async def import_folder_from_drive(
    request: DriveImportRequest,
    target_folder_id: Optional[UUID] = None,
    db: Session = Depends(get_db)
):
    import os
    api_key = os.getenv("GOOGLE_DRIVE_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="GOOGLE_DRIVE_API_KEY is not set in backend/.env. Please add it to import whole folders."
        )

    try:
        drive_folder_id = convert_drive_folder_url_to_id(request.url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # List files in the folder using Google Drive API
    files_url = f"https://www.googleapis.com/drive/v3/files?q='{drive_folder_id}'+in+parents+and+trashed=false&key={api_key}&fields=files(id,name,mimeType)"

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(files_url)
        if response.status_code != 200:
            detail = response.json().get("error", {}).get("message", "Failed to list files from Google Drive")
            raise HTTPException(status_code=response.status_code, detail=detail)

        files = response.json().get("files", [])

    imported_docs = []
    for f in files:
        drive_file_id = f["id"]
        filename = f["name"]
        mime_type = f["mimeType"]

        # Basic mime type to app file type conversion
        if "pdf" in mime_type:
            file_type = "pdf"
        elif "video" in mime_type:
            file_type = "video"
        elif "audio" in mime_type:
            file_type = "mp3"
        elif "image" in mime_type:
            file_type = "image"
        else:
            continue  # Skip unknown types

        direct_download_url = f"https://drive.google.com/uc?export=download&id={drive_file_id}&confirm=t"

        try:
            upload_result = upload_from_url(direct_download_url, file_type)
            doc_data = DocumentCreate(
                title=filename,
                description=f"Imported from Drive folder: {request.title}",
                file_type=file_type,
                cloudinary_url=upload_result["url"],
                cloudinary_public_id=upload_result["public_id"],
                drive_url=f"https://drive.google.com/file/d/{drive_file_id}/view",
                folder_id=target_folder_id
            )
            imported_docs.append(crud.create_document(db, doc_data))
        except Exception as e:
            # Continue importing other files even if one fails
            print(f"Failed to import {filename}: {str(e)}")

    return {"message": f"Successfully imported {len(imported_docs)} files.", "documents": imported_docs}
