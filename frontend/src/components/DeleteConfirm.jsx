import React, { useState } from "react";
import { deleteDocument, deleteFolder } from "../api/api";

export default function DeleteConfirm({ doc, isFolder = false, onClose, onSuccess, addToast }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (isFolder) {
        await deleteFolder(doc.id);
        addToast("Đã xoá thư mục! 🗑️", "success");
      } else {
        await deleteDocument(doc.id);
        addToast("Đã xoá tài liệu! 🗑️", "success");
      }
      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.detail || "Xoá thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🗑️ Xác nhận xoá</h2>
          <button className="btn-icon" onClick={onClose}>×</button>
        </div>
        <div className="modal-body" style={{ textAlign: "center", padding: "32px 24px" }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>⚠️</div>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Bạn có chắc muốn xoá {isFolder ? "thư mục" : "tài liệu"}{" "}
            <strong style={{ color: "var(--text-primary)" }}>"{doc?.title}"</strong>?
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Huỷ</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Đang xoá...</> : "🗑️ Xoá"}
          </button>
        </div>
      </div>
    </div>
  );
}
