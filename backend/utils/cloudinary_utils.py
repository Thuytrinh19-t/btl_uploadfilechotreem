import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


def get_resource_type(file_type: str) -> str:
    if file_type == "video":
        return "video"
    elif file_type == "mp3":
        return "video"  # Cloudinary uses "video" resource type for audio
    else:
        return "raw"


def upload_file(file_bytes: bytes, filename: str, file_type: str) -> dict:
    resource_type = get_resource_type(file_type)
    result = cloudinary.uploader.upload(
        file_bytes,
        resource_type=resource_type,
        folder="be-documents",
        use_filename=True,
        unique_filename=True,
    )
    return {
        "url": result.get("secure_url"),
        "public_id": result.get("public_id"),
    }


def upload_from_url(url: str, file_type: str) -> dict:
    resource_type = get_resource_type(file_type)
    result = cloudinary.uploader.upload(
        url,
        resource_type=resource_type,
        folder="be-documents",
        use_filename=True,
        unique_filename=True,
    )
    return {
        "url": result.get("secure_url"),
        "public_id": result.get("public_id"),
    }


def delete_file(public_id: str, file_type: str) -> None:
    resource_type = get_resource_type(file_type)
    cloudinary.uploader.destroy(public_id, resource_type=resource_type)
