import React, { useState, useEffect, useCallback } from "react";
import UploadModal from "../components/UploadModal";
import EditModal from "../components/EditModal";
import DeleteConfirm from "../components/DeleteConfirm";
import DocumentViewer from "../components/DocumentViewer";
import DocumentCard from "../components/DocumentCard";
import DriveImportModal from "../components/DriveImportModal";
import FolderCard from "../components/FolderCard";
import CreateFolderModal from "../components/CreateFolderModal";
import { getDocuments, getFolders, updateDocument } from "../api/api";

const FILTERS = ["all", "pdf", "video", "mp3", "image", "website"];
const FILTER_LABELS = { 
  all: "🗂️ Tất cả", 
  pdf: "📄 PDF", 
  video: "🎬 Video", 
  mp3: "🎵 MP3", 
  image: "🖼️ Ảnh",
  website: "🔗 Website" 
};

export default function HomePage({ addToast, username, onLogout }) {
  const [docs, setDocs] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // 'upload' | 'edit' | 'delete' | 'view' | 'drive' | 'folder' | 'editFolder'
  const [selected, setSelected] = useState(null);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const [docsRes, foldersRes] = await Promise.all([
        getDocuments(currentFolderId),
        getFolders(currentFolderId)
      ]);
      setDocs(docsRes.data);
      setFolders(foldersRes.data);
    } catch {
      addToast("Không thể tải dữ liệu!", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast, currentFolderId]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleEnterFolder = (folder) => {
    setBreadcrumbs([...breadcrumbs, folder]);
    setCurrentFolderId(folder.id);
  };

  const handleNavigate = (folderId, index) => {
    if (folderId === null) {
      setBreadcrumbs([]);
      setCurrentFolderId(null);
    } else {
      setBreadcrumbs(breadcrumbs.slice(0, index + 1));
      setCurrentFolderId(folderId);
    }
  };

  const filtered = docs.filter((d) => {
    const matchType = filter === "all" || d.file_type === filter;
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.description || "").toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const fileDocs = filtered.filter((d) => d.file_type !== "website");
  const websiteDocs = docs
    .filter((d) => d.file_type === "website")
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const handleMoveDocument = async (documentId, targetFolderId) => {
    try {
      await updateDocument(documentId, { folder_id: targetFolderId });
      addToast("Đã di chuyển tài liệu vào thư mục!", "success");
      fetchDocs();
    } catch {
      addToast("Không thể di chuyển tài liệu!", "error");
    }
  };

  const handleGoBack = () => {
    if (breadcrumbs.length === 0) return;
    if (breadcrumbs.length === 1) {
      handleNavigate(null);
    } else {
      handleNavigate(breadcrumbs[breadcrumbs.length - 2].id, breadcrumbs.length - 2);
    }
  };

  const groupByDate = (items) => {
    const groups = {};
    items.forEach((item) => {
      const date = new Date(item.created_at).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return groups;
  };

  const fileDocsGrouped = groupByDate(fileDocs);
  const websiteDocsGrouped = groupByDate(websiteDocs);

  const openModal = (type, doc = null) => { setModal(type); setSelected(doc); };
  const closeModal = () => { setModal(null); setSelected(null); };

  return (
    <div className="home-page">
      {/* Header */}
      <header className="site-header">
        <div className="container">
          <div className="header-inner">
            <div className="header-brand">
              <div className="brand-logo">📚</div>
              <div>
                <h1 className="brand-name">Tài liệu của Nhật Minh - 1S5</h1>
                <p className="brand-subtitle">Quản lý tài liệu PDF · Video · MP3 · Website</p>
              </div>
            </div>
            <div className="header-actions">
              <span className="user-chip">{username}</span>
              <button className="btn btn-secondary" onClick={() => openModal("folder")}>
                📁 Folder+
              </button>
              <button className="btn btn-secondary" onClick={() => openModal("drive")}>
                🔗 Import Drive
              </button>
              <button className="btn btn-primary" onClick={() => openModal("upload")}>
                ⬆️ Upload
              </button>
              <button className="btn btn-secondary" onClick={onLogout}>
                Dang xuat
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="container">
        <div className="controls-bar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Tìm theo tên, mô tả..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch("")}>×</button>
            )}
          </div>
          <div className="filter-tabs">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation bar with Back button and Breadcrumbs */}
        <div className="nav-bar" style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "15px" }}>
          {currentFolderId !== null && (
            <button className="btn btn-secondary btn-sm" onClick={handleGoBack} style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
              ⬅️ Quay lại
            </button>
          )}

          <div className="breadcrumbs" style={{ margin: 0, fontSize: "0.9rem", display: "flex", gap: "5px", alignItems: "center", flex: 1 }}>
            <span 
              className="breadcrumb-item" 
              style={{ cursor: "pointer", color: "var(--accent)" }}
              onClick={() => handleNavigate(null)}
            >
              🏠 Trang Chủ
            </span>
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={b.id}>
                <span className="breadcrumb-separator">/</span>
                <span 
                  className="breadcrumb-item" 
                  style={{ cursor: i === breadcrumbs.length - 1 ? "default" : "pointer", color: i === breadcrumbs.length - 1 ? "var(--text-secondary)" : "var(--accent)" }}
                  onClick={() => i !== breadcrumbs.length - 1 && handleNavigate(b.id, i)}
                >
                  {b.name}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-bar">
          <span className="stats-count">
            {loading ? "..." : `${folders.length} thư mục, ${fileDocs.length} tài liệu, ${websiteDocs.length} website`}
          </span>
        </div>

        {/* Main Content Layout */}
        <div className="main-content-layout">
          <div className="left-column">
            {loading ? (
              <div className="loading-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="doc-card-skeleton" />
                ))}
              </div>
            ) : (fileDocs.length === 0 && folders.length === 0) ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>Thư mục trống</h3>
                <p>Hãy upload hoặc import từ Google Drive để bắt đầu.</p>
                <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => openModal("upload")}>
                  ⬆️ Upload ngay
                </button>
              </div>
            ) : (
              <div className="document-sections">
                {filter === "all" && folders.length > 0 && (
                  <div className="section-block">
                    <h3 className="section-title">📁 Thư mục</h3>
                    <div className="doc-grid">
                      {folders.map((folder) => (
                        <FolderCard
                          key={folder.id}
                          folder={folder}
                          onClick={handleEnterFolder}
                          onEdit={(f) => openModal("editFolder", f)}
                          onDelete={(f) => openModal("deleteFolder", f)}
                          onMove={handleMoveDocument}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {Object.entries(fileDocsGrouped).map(([date, items]) => (
                  <div key={date} className="section-block date-section">
                    <h3 className="section-title date-header">📅 {date}</h3>
                    <div className="doc-grid">
                      {items.map((doc) => (
                        <DocumentCard
                          key={doc.id}
                          doc={doc}
                          onView={(d) => openModal("view", d)}
                          onEdit={(d) => openModal("edit", d)}
                          onDelete={(d) => openModal("delete", d)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar for Websites */}
          {(filter === "all" || filter === "website") && websiteDocs.length > 0 && (
            <div className="right-sidebar">
              <div className="website-list-card">
                <div className="website-list-header">
                  <h3>🔗 Website / Links</h3>
                  <span className="count-badge">{websiteDocs.length}</span>
                </div>
                <div className="website-list-content">
                  {Object.entries(websiteDocsGrouped).map(([date, items]) => (
                    <div key={date} className="website-date-group">
                      <div className="website-date-label">{date}</div>
                      {items.map((link) => (
                        <div key={link.id} className="website-item" title={`Tiêu đề: ${link.title}`}>
                        <div className="website-item-info" onClick={() => window.open(link.cloudinary_url, "_blank")}>
                          <div className="website-item-title">{link.title || "Không có tiêu đề"}</div>
                          <div className="website-item-url" title={link.title}>{link.cloudinary_url}</div>
                        </div>
                          <div className="website-item-actions">
                            <button 
                              className="btn-icon btn-sm delete-btn" 
                              title="Xoá"
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal("delete", link);
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal === "view" && (
        <DocumentViewer doc={selected} onClose={closeModal} />
      )}
      {modal === "upload" && (
        <UploadModal 
          onClose={closeModal} 
          onSuccess={fetchDocs} 
          addToast={addToast} 
          folderId={currentFolderId} 
        />
      )}
      {modal === "edit" && (
        <EditModal doc={selected} onClose={closeModal} onSuccess={fetchDocs} addToast={addToast} />
      )}
      {modal === "delete" && (
        <DeleteConfirm doc={selected} onClose={closeModal} onSuccess={fetchDocs} addToast={addToast} />
      )}
      {modal === "drive" && (
        <DriveImportModal 
          onClose={closeModal} 
          onSuccess={fetchDocs} 
          addToast={addToast} 
          folderId={currentFolderId} 
        />
      )}
      {(modal === "folder" || modal === "editFolder") && (
        <CreateFolderModal
          folder={modal === "editFolder" ? selected : null}
          parentId={currentFolderId}
          onClose={closeModal}
          onSuccess={fetchDocs}
          addToast={addToast}
        />
      )}
      {modal === "deleteFolder" && (
        <DeleteConfirm 
          doc={{ ...selected, title: selected.name }} 
          isFolder={true}
          onClose={closeModal} 
          onSuccess={fetchDocs} 
          addToast={addToast} 
        />
      )}
    </div>
  );
}
