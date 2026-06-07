from sqlalchemy.orm import Session
from sqlalchemy import desc
from models import Document, Folder
from schemas import DocumentCreate, DocumentUpdate, FolderCreate, FolderUpdate
from datetime import datetime
import uuid
from uuid import UUID


def get_documents(db: Session, folder_id: UUID = None, skip: int = 0, limit: int = 100):
    query = db.query(Document)
    if folder_id:
        query = query.filter(Document.folder_id == folder_id)
    else:
        query = query.filter(Document.folder_id == None)
    return query.order_by(desc(Document.created_at)).offset(skip).limit(limit).all()


def get_document(db: Session, document_id: UUID):
    return db.query(Document).filter(Document.id == document_id).first()


def create_document(db: Session, doc: DocumentCreate):
    db_doc = Document(
        id=uuid.uuid4(),
        title=doc.title,
        description=doc.description,
        file_type=doc.file_type,
        cloudinary_url=doc.cloudinary_url,
        cloudinary_public_id=doc.cloudinary_public_id,
        drive_url=doc.drive_url,
        folder_id=doc.folder_id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc


def get_folders(db: Session, parent_id: UUID = None):
    query = db.query(Folder)
    if parent_id:
        query = query.filter(Folder.parent_id == parent_id)
    else:
        query = query.filter(Folder.parent_id == None)
    return query.order_by(Folder.name).all()


def get_folder(db: Session, folder_id: UUID):
    return db.query(Folder).filter(Folder.id == folder_id).first()


def create_folder(db: Session, folder: FolderCreate):
    db_folder = Folder(
        id=uuid.uuid4(),
        name=folder.name,
        parent_id=folder.parent_id,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)
    return db_folder


def update_folder(db: Session, folder_id: UUID, folder_update: FolderUpdate):
    db_folder = db.query(Folder).filter(Folder.id == folder_id).first()
    if not db_folder:
        return None
    if folder_update.name is not None:
        db_folder.name = folder_update.name
    db_folder.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_folder)
    return db_folder


def delete_folder(db: Session, folder_id: UUID):
    db_folder = db.query(Folder).filter(Folder.id == folder_id).first()
    if db_folder:
        # Note: You might want to handle recursive delete or move files here
        db.delete(db_folder)
        db.commit()
    return db_folder


def update_document(db: Session, document_id: UUID, doc_update: DocumentUpdate):
    db_doc = db.query(Document).filter(Document.id == document_id).first()
    if not db_doc:
        return None
    if doc_update.title is not None:
        db_doc.title = doc_update.title
    if doc_update.description is not None:
        db_doc.description = doc_update.description
    if doc_update.folder_id is not None:
        db_doc.folder_id = doc_update.folder_id
    db_doc.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_doc)
    return db_doc


def delete_document(db: Session, document_id: UUID):
    db_doc = db.query(Document).filter(Document.id == document_id).first()
    if db_doc:
        db.delete(db_doc)
        db.commit()
    return db_doc
