import React, { useState } from "react";
import { createFolder, updateFolder } from "../api/api";

export default function CreateFolderModal({ folder = null, parentId = null, onClose, onSuccess, addToast }) {
  const [name, setName] = useState(folder ? folder.name : "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return addToast("Vui lòng nhập tên thư mục!", "error");

    setLoading(true);
    try {
      if (folder) {
        await updateFolder(folder.id, { name });
        addToast("Cập nhật thư mục thành công!", "success");
      } else {
        await createFolder({ name, parent_id: parentId });
        addToast("Tạo thư mục thành công! 📁", "success");
      }
      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.detail || "Thao tác thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{folder ? "✏️ Đổi tên thư mục" : "📁 Tạo thư mục mới"}</h2>
          <button className="btn-icon" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Tên thư mục *</label>
              <input
                className="form-input"
                placeholder="Ví dụ: Môn Toán, Tài liệu học tập..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Huỷ</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Đang lưu..." : (folder ? "Cập nhật" : "Tạo thư mục")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
