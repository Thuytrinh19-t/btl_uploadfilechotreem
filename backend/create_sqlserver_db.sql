IF DB_ID(N'DocumentManager') IS NULL
BEGIN
    CREATE DATABASE DocumentManager;
END
GO

USE DocumentManager;
GO

IF OBJECT_ID(N'dbo.users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.users (
        id UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT pk_users PRIMARY KEY,
        username NVARCHAR(100) NOT NULL,
        email NVARCHAR(255) NULL,
        password_hash NVARCHAR(500) NOT NULL,
        is_active BIT NOT NULL
            CONSTRAINT df_users_is_active DEFAULT 1,
        created_at DATETIME2 NULL
            CONSTRAINT df_users_created_at DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NULL
            CONSTRAINT df_users_updated_at DEFAULT SYSUTCDATETIME()
    );
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'ux_users_username'
      AND object_id = OBJECT_ID(N'dbo.users')
)
BEGIN
    CREATE UNIQUE INDEX ux_users_username ON dbo.users(username);
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'ux_users_email'
      AND object_id = OBJECT_ID(N'dbo.users')
)
BEGIN
    CREATE UNIQUE INDEX ux_users_email ON dbo.users(email) WHERE email IS NOT NULL;
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM dbo.users
    WHERE username = N'admin'
)
BEGIN
    INSERT INTO dbo.users (
        id,
        username,
        email,
        password_hash,
        is_active,
        created_at,
        updated_at
    )
    VALUES (
        NEWID(),
        N'admin',
        NULL,
        N'pbkdf2_sha256$260000$1098897a83653c30acf6c309d6ca84a2$7411b70761011952294269f35e6cd0ce6d9c9c53885510233571312c62cd8ae2',
        1,
        SYSUTCDATETIME(),
        SYSUTCDATETIME()
    );
END
GO

IF OBJECT_ID(N'dbo.folders', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.folders (
        id UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT pk_folders PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        parent_id UNIQUEIDENTIFIER NULL,
        created_at DATETIME2 NULL
            CONSTRAINT df_folders_created_at DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NULL
            CONSTRAINT df_folders_updated_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_folders_parent
            FOREIGN KEY (parent_id) REFERENCES dbo.folders(id)
    );
END
GO

IF OBJECT_ID(N'dbo.documents', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.documents (
        id UNIQUEIDENTIFIER NOT NULL
            CONSTRAINT pk_documents PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX) NULL,
        file_type VARCHAR(20) NOT NULL,
        cloudinary_url NVARCHAR(500) NULL,
        cloudinary_public_id NVARCHAR(255) NULL,
        drive_url NVARCHAR(500) NULL,
        folder_id UNIQUEIDENTIFIER NULL,
        created_at DATETIME2 NULL
            CONSTRAINT df_documents_created_at DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NULL
            CONSTRAINT df_documents_updated_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT ck_documents_file_type
            CHECK (file_type IN ('pdf', 'video', 'mp3', 'image', 'website')),
        CONSTRAINT fk_documents_folder
            FOREIGN KEY (folder_id) REFERENCES dbo.folders(id)
    );
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'ix_folders_parent_id'
      AND object_id = OBJECT_ID(N'dbo.folders')
)
BEGIN
    CREATE INDEX ix_folders_parent_id ON dbo.folders(parent_id);
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'ix_documents_folder_id'
      AND object_id = OBJECT_ID(N'dbo.documents')
)
BEGIN
    CREATE INDEX ix_documents_folder_id ON dbo.documents(folder_id);
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = N'ix_documents_created_at'
      AND object_id = OBJECT_ID(N'dbo.documents')
)
BEGIN
    CREATE INDEX ix_documents_created_at ON dbo.documents(created_at DESC);
END
GO
