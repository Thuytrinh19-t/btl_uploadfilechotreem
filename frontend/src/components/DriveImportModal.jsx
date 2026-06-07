import React, { useState } from "react";
import { importFromDrive, importFolderFromDrive } from "../api/api";

const FILE_TYPE_HINTS = {
  pdf: "PDF",
  video: "Video (MP4, MOV...)",
  mp3: "Audio (MP3, WAV...)",
};

export default function DriveImportModal({ onClose, onSuccess, addToast, folderId = null }) {
  const [form, setForm] = useState({ url: "", title: "", description: "", file_type: "pdf" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.url.trim()) return addToast("Vui lòng nhập link Google Drive!", "error");
    if (!form.url.includes("drive.google.com"))
      return addToast("Link phải từ Google Drive!", "error");
    if (!form.title.trim()) return addToast("Vui lòng nhập tiêu đề!", "error");

    setLoading(true);
    try {
      if (form.url.includes("/folders/")) {
        await importFolderFromDrive(form, folderId);
        addToast("Đang import cả thư mục... Vui lòng đợi! ⏳", "success");
      } else {
        await importFromDrive(form, folderId);
        addToast("Import từ Drive thành công! 🎉", "success");
      }
      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.detail || "Import thất bại! Kiểm tra link Drive và quyền truy cập.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔗 Import từ Google Drive</h2>
          <button className="btn-icon" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="drive-info-box">
              <p>⚠️ File trên Drive phải được <strong>chia sẻ công khai</strong> (Anyone with the link)</p>
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Link Google Drive *</label>
              <input
                name="url"
                className="form-input"
                placeholder="https://drive.google.com/file/d/..."
                value={form.url}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Loại file</label>
              <select name="file_type" className="form-select" value={form.file_type} onChange={handleChange}>
                {Object.entries(FILE_TYPE_HINTS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tiêu đề *</label>
              <input
                name="title"
                className="form-input"
                placeholder="Tên tài liệu..."
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mô tả</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Mô tả ngắn (tuỳ chọn)..."
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Huỷ</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Đang import...</> : "🔗 Import"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
