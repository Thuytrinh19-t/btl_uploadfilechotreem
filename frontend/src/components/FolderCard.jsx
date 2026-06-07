import React from "react";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function FolderCard({ folder, onClick, onEdit, onDelete, onMove }) {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const documentId = e.dataTransfer.getData("documentId");
    if (documentId && onMove) {
      onMove(documentId, folder.id);
    }
  };

  return (
    <div 
      className={`doc-card folder-card ${isDragOver ? "drag-over" : ""}`} 
      onClick={() => onClick(folder)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={isDragOver ? { border: "2px dashed #ff9800", transform: "scale(1.02)" } : {}}
    >
      <div className="doc-card-thumb" style={{ background: "#fff5e6" }}>
        <span className="doc-card-icon">📁</span>
        <span className="badge" style={{ background: "#ff9800", color: "#fff" }}>Thư mục</span>
      </div>
      <div className="doc-card-body">
        <h3 className="doc-card-title">{folder.name}</h3>
        <p className="doc-card-date">📅 {formatDate(folder.created_at)}</p>
      </div>
      <div className="doc-card-actions" onClick={(e) => e.stopPropagation()}>
        <button className="btn-icon" title="Đổi tên / Sửa" onClick={() => onEdit(folder)}>✏️</button>
        <button className="btn-icon" title="Xóa" onClick={() => onDelete(folder)}>🗑️</button>
      </div>
    </div>
  );
}
