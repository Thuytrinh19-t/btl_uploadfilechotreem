from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional, List
from database import get_db
from auth import get_current_user
from schemas import DocumentResponse, DocumentUpdate
from models import FileType
import crud
from utils.cloudinary_utils import upload_file, delete_file

router = APIRouter(prefix="/documents", tags=["documents"], dependencies=[Depends(get_current_user)])


@router.get("", response_model=List[DocumentResponse])
def list_documents(folder_id: Optional[UUID] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_documents(db, folder_id=folder_id, skip=skip, limit=limit)


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(document_id: str, db: Session = Depends(get_db)):
    doc = crud.get_document(db, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.post("", response_model=DocumentResponse)
async def create_document(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    file_type: FileType = Form(...),
    file: Optional[UploadFile] = File(None),
    website_url: Optional[str] = Form(None),
    folder_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    cloudinary_url = None
    cloudinary_public_id = None

    if file_type == FileType.website:
        cloudinary_url = website_url
    elif file:
        file_bytes = await file.read()
        result = upload_file(file_bytes, file.filename, file_type.value)
        cloudinary_url = result["url"]
        cloudinary_public_id = result["public_id"]
    else:
        raise HTTPException(status_code=400, detail="File is required for this file type")

    from schemas import DocumentCreate
    doc_data = DocumentCreate(
        title=title,
        description=description,
        file_type=file_type,
        cloudinary_url=cloudinary_url,
        cloudinary_public_id=cloudinary_public_id,
        folder_id=folder_id
    )
    return crud.create_document(db, doc_data)


@router.put("/{document_id}", response_model=DocumentResponse)
def update_document(document_id: str, doc_update: DocumentUpdate, db: Session = Depends(get_db)):
    doc = crud.update_document(db, document_id, doc_update)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.delete("/{document_id}")
def delete_document(document_id: str, db: Session = Depends(get_db)):
    doc = crud.get_document(db, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc.cloudinary_public_id:
        try:
            delete_file(doc.cloudinary_public_id, doc.file_type.value)
        except Exception:
            pass
    crud.delete_document(db, document_id)
    return {"message": "Document deleted successfully"}
