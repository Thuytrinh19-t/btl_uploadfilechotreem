from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import make_url
from sqlalchemy import text
import os
import re
from dotenv import load_dotenv

load_dotenv()

DEFAULT_DATABASE_URL = (
    "mssql+pyodbc://sa:It123456%40@./DocumentManager"
    "?driver=ODBC+Driver+17+for+SQL+Server&Encrypt=no&TrustServerCertificate=yes"
)
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)


def _ensure_sql_server_database_exists(database_url: str):
    url = make_url(database_url)
    if not url.drivername.startswith("mssql") or not url.database:
        return

    database_name = url.database
    if not re.match(r"^[A-Za-z0-9_\-]+$", database_name):
        raise ValueError("SQL Server database name contains unsupported characters.")

    master_url = url.set(database="master")
    master_engine = create_engine(master_url, isolation_level="AUTOCOMMIT")
    with master_engine.connect() as conn:
        exists = conn.execute(
            text("SELECT DB_ID(:database_name)"),
            {"database_name": database_name},
        ).scalar()
        if exists is None:
            conn.execute(text(f"CREATE DATABASE [{database_name}]"))
    master_engine.dispose()


_ensure_sql_server_database_exists(DATABASE_URL)
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
