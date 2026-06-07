from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
from schemas import FolderCreate, FolderUpdate, FolderResponse
import crud
from typing import List, Optional
from uuid import UUID

router = APIRouter(prefix="/folders", tags=["folders"], dependencies=[Depends(get_current_user)])


@router.get("", response_model=List[FolderResponse])
def read_folders(parent_id: Optional[UUID] = None, db: Session = Depends(get_db)):
    return crud.get_folders(db, parent_id=parent_id)


@router.get("/{folder_id}", response_model=FolderResponse)
def read_folder(folder_id: UUID, db: Session = Depends(get_db)):
    db_folder = crud.get_folder(db, folder_id=folder_id)
    if not db_folder:
        raise HTTPException(status_code=404, detail="Folder not found")
    return db_folder


@router.post("", response_model=FolderResponse)
def create_folder(folder: FolderCreate, db: Session = Depends(get_db)):
    return crud.create_folder(db, folder)


@router.put("/{folder_id}", response_model=FolderResponse)
def update_folder(folder_id: UUID, folder_update: FolderUpdate, db: Session = Depends(get_db)):
    db_folder = crud.update_folder(db, folder_id, folder_update)
    if not db_folder:
        raise HTTPException(status_code=404, detail="Folder not found")
    return db_folder


@router.delete("/{folder_id}")
def delete_folder(folder_id: UUID, db: Session = Depends(get_db)):
    db_folder = crud.get_folder(db, folder_id=folder_id)
    if not db_folder:
        raise HTTPException(status_code=404, detail="Folder not found")

    # Kiểm tra xem thư mục có dữ liệu không
    if db_folder.documents or db_folder.subfolders:
        raise HTTPException(
            status_code=400,
            detail="Thư mục không trống! Vui lòng xóa/di chuyển các file và thư mục con ra ngoài trước."
        )

    crud.delete_folder(db, folder_id)
    return {"message": "Folder deleted successfully"}
