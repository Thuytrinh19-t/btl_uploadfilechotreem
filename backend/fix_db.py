import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


def fix_database():
    if not DATABASE_URL:
        print("DATABASE_URL not found in .env")
        return

    engine = create_engine(DATABASE_URL)

    with engine.connect() as conn:
        print("Connecting to database...")
        inspector = inspect(conn)

        if not inspector.has_table("folders"):
            print("Creating 'folders' table...")
            conn.execute(text("""
                CREATE TABLE folders (
                    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
                    name NVARCHAR(255) NOT NULL,
                    parent_id UNIQUEIDENTIFIER NULL,
                    created_at DATETIME2 NULL,
                    updated_at DATETIME2 NULL,
                    CONSTRAINT fk_folders_parent
                        FOREIGN KEY(parent_id) REFERENCES folders(id)
                )
            """))
        else:
            print("'folders' table already exists.")

        if inspector.has_table("documents"):
            columns = {column["name"] for column in inspector.get_columns("documents")}
            if "folder_id" not in columns:
                print("Adding 'folder_id' column to 'documents' table...")
                conn.execute(text("ALTER TABLE documents ADD folder_id UNIQUEIDENTIFIER NULL"))
                conn.execute(text("""
                    ALTER TABLE documents
                    ADD CONSTRAINT fk_documents_folder
                        FOREIGN KEY(folder_id) REFERENCES folders(id)
                """))
                print("Successfully added folder_id column.")
            else:
                print("Column 'folder_id' already exists.")
        else:
            print("'documents' table does not exist yet. Run the FastAPI app to create it.")

        conn.commit()
        print("Database schema updated successfully!")


if __name__ == "__main__":
    fix_database()
