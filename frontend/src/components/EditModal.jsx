import React, { useState, useEffect } from "react";
import { updateDocument } from "../api/api";

export default function EditModal({ doc, onClose, onSuccess, addToast }) {
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doc) {
      setForm({ title: doc.title || "", description: doc.description || "" });
    }
  }, [doc]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return addToast("Tiêu đề không được trống!", "error");
    setLoading(true);
    try {
      await updateDocument(doc.id, form);
      addToast("Cập nhật thành công! ✅", "success");
      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.detail || "Cập nhật thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Đổi tên & Chỉnh sửa tài liệu</h2>
          <button className="btn-icon" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Tiêu đề *</label>
              <input
                name="title"
                className="form-input"
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
                value={form.description}
                onChange={handleChange}
                placeholder="Mô tả ngắn..."
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Huỷ</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Đang lưu...</> : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
