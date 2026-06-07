import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadDocument } from "../api/api";

const FILE_TYPES = [
  { value: "pdf", label: "📄 PDF" },
  { value: "video", label: "🎬 Video" },
  { value: "mp3", label: "🎵 MP3" },
  { value: "image", label: "🖼️ Ảnh" },
  { value: "website", label: "🔗 Website" },
];

const ACCEPT_MAP = {
  pdf: { "application/pdf": [".pdf"] },
  video: { "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"] },
  mp3: { "audio/*": [".mp3", ".wav", ".ogg", ".aac"] },
  image: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"] },
  website: {},
};

export default function UploadModal({ onClose, onSuccess, addToast, folderId = null }) {
  const [form, setForm] = useState({ title: "", description: "", file_type: "pdf", website_url: "" });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentProgress, setCurrentProgress] = useState({ current: 0, total: 0 });

  const onDrop = useCallback((accepted) => {
    setFiles((prev) => [...prev, ...accepted]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT_MAP[form.file_type],
    multiple: true,
  });

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === "file_type") {
      setFiles([]);
      setForm(p => ({ ...p, website_url: "" }));
    }
  };

  const extractTitleFromUrl = (url) => {
    try {
      const urlObj = new URL(url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`);
      const decodedPath = decodeURIComponent(urlObj.pathname);
      const segments = decodedPath.split("/").filter((s) => s);
      if (segments.length === 0) return urlObj.hostname;
      return segments.join("-");
    } catch {
      return url.trim();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.file_type === "website") {
      if (!form.website_url.trim()) return addToast("Vui lòng nhập địa chỉ website!", "error");
    } else if (files.length === 0) {
      return addToast("Vui lòng chọn ít nhất một file!", "error");
    }
    
    setLoading(true);

    if (form.file_type === "website") {
      const urls = form.website_url.split(",").map(u => u.trim()).filter(u => u);
      setCurrentProgress({ current: 0, total: urls.length });
      let successCount = 0;

      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        setCurrentProgress({ current: i + 1, total: urls.length });
        
        try {
          const fd = new FormData();
          // Use user title if provided and only 1 link, otherwise extract from URL
          const title = (urls.length === 1 && form.title.trim()) ? form.title : extractTitleFromUrl(url);
          
          fd.append("title", title);
          fd.append("description", form.description);
          fd.append("file_type", "website");
          fd.append("website_url", url);
          if (folderId) fd.append("folder_id", folderId);
          
          await uploadDocument(fd);
          successCount++;
        } catch (err) {
          addToast(`Lỗi khi lưu link ${url}: ${err.response?.data?.detail || "Thất bại"}`, "error");
        }
      }

      if (successCount > 0) {
        addToast(`Đã lưu thành công ${successCount} link website! 🔗`, "success");
        onSuccess();
        onClose();
      }
    } else {
      setCurrentProgress({ current: 0, total: files.length });
      let successCount = 0;
      for (let i = 0; i < files.length; i++) {
        setCurrentProgress({ current: i + 1, total: files.length });
        try {
          const fd = new FormData();
          const title = files.length === 1 ? (form.title || files[i].name) : files[i].name;
          fd.append("title", title);
          fd.append("description", form.description);
          fd.append("file_type", form.file_type);
          fd.append("file", files[i]);
          if (folderId) fd.append("folder_id", folderId);
          await uploadDocument(fd);
          successCount++;
        } catch (err) {
          addToast(`Lỗi khi upload ${files[i].name}: ${err.response?.data?.detail || "Thất bại"}`, "error");
        }
      }
      if (successCount > 0) {
        addToast(`Đã upload thành công ${successCount} file! 🎉`, "success");
        onSuccess();
        onClose();
      }
    }
    setLoading(false);
  };

  const handleClose = () => {
    if (files.length > 0 || (form.file_type === "website" && form.website_url)) {
      if (window.confirm("Bạn có chắc muốn huỷ? Dữ liệu chưa lưu sẽ bị mất.")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⬆️ {form.file_type === "website" ? "Thêm Link Website" : "Upload Tài liệu"}</h2>
          <button className="btn-icon" onClick={handleClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Loại</label>
              <select name="file_type" className="form-select" value={form.file_type} onChange={handleChange}>
                {FILE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            
            {(form.file_type === "website" || files.length <= 1) && (
              <div className="form-group">
                <label className="form-label">Tiêu đề {form.file_type === "website" ? "(tuỳ chọn)" : "*"}</label>
                <input
                  name="title"
                  className="form-input"
                  placeholder={form.file_type === "website" ? "Để trống để tự lấy từ link" : "Ví dụ: Bài tập Tiếng Anh, Video học tập..."}
                  value={form.title}
                  onChange={handleChange}
                  required={form.file_type !== "website"}
                />
              </div>
            )}

            {form.file_type === "website" && (
              <div className="form-group">
                <label className="form-label">Danh sách Link Website (ngăn cách bởi dấu phẩy) *</label>
                <textarea
                  name="website_url"
                  className="form-textarea"
                  style={{ height: "100px" }}
                  placeholder="https://link1.com, https://link2.com..."
                  value={form.website_url}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Mô tả (tuỳ chọn)</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Mô tả cho nội dung này..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {form.file_type !== "website" && (
              <>
                <div className="form-group">
                  <label className="form-label">Files ({files.length} đã chọn)</label>
                  <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
                    <input {...getInputProps()} />
                    <div className="dropzone-icon">
                      {form.file_type === "pdf" ? "📄" : form.file_type === "video" ? "🎬" : form.file_type === "mp3" ? "🎵" : "🖼️"}
                    </div>
                    {isDragActive ? (
                      <p>Thả các file vào đây...</p>
                    ) : (
                      <p>Kéo thả nhiều file hoặc <strong>click để chọn</strong></p>
                    )}
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="file-list-preview" style={{ marginTop: 15, maxHeight: 150, overflowY: "auto", border: "1px solid var(--border)", borderRadius: 8, padding: 8, background: "var(--bg-secondary)" }}>
                    {files.map((f, idx) => (
                      <div key={idx} className="file-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "var(--bg-card)", marginBottom: 4, borderRadius: 6, fontSize: "0.85rem", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>
                          {idx + 1}. {f.name}
                        </span>
                        <button type="button" className="btn-icon" onClick={() => removeFile(idx)} style={{ color: "var(--danger)", padding: 4 }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={loading}>Huỷ</button>
            <button type="submit" className="btn btn-primary" disabled={loading || (form.file_type !== "website" && files.length === 0)}>
              {loading ? (
                <><span className="spinner" style={{ width: 16, height: 16 }} /> {form.file_type === "website" ? "Đang lưu..." : `Đang upload ${currentProgress.current}/${currentProgress.total}...`}</>
              ) : (
                form.file_type === "website" ? "💾 Lưu Link" : `⬆️ Upload ${files.length} file`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
