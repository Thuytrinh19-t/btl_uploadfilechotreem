import React from "react";

const TYPE_ICONS = {
  pdf: "📄",
  video: "🎬",
  mp3: "🎵",
  image: "🖼️",
  website: "🔗",
};

const TYPE_LABELS = {
  pdf: "PDF",
  video: "Video",
  mp3: "MP3",
  image: "Ảnh",
  website: "Website",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function DocumentCard({ doc, onView, onEdit, onDelete }) {
  const getBaseDownloadUrl = () => {
    if (doc.cloudinary_url) {
      return doc.cloudinary_url.replace("/upload/", "/upload/fl_attachment/");
    }
    if (doc.drive_id) {
      return `https://drive.google.com/uc?export=download&id=${doc.drive_id}`;
    }
    if (doc.drive_url) {
      return doc.drive_url
        .replace("file/d/", "uc?export=download&id=")
        .replace("/view?usp=sharing", "")
        .replace("/view", "");
    }
    return "#";
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const url = getBaseDownloadUrl();
    if (!url || url === "#") return;

    // Extract extension from original URL
    const originalUrl = doc.cloudinary_url || "";
    const lastSlash = originalUrl.lastIndexOf("/");
    const filenameFromUrl = lastSlash !== -1 ? originalUrl.substring(lastSlash + 1) : originalUrl;
    const lastDot = filenameFromUrl.lastIndexOf(".");
    const ext = lastDot !== -1 ? filenameFromUrl.substring(lastDot + 1) : "";
    const finalFilename = ext ? `${doc.title}.${ext}` : doc.title;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Fetch failed");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn("Fetch-based download failed, falling back to direct link.", err);
      window.open(url, "_blank");
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData("documentId", doc.id);
    e.dataTransfer.effectAllowed = "move";
  };

    const handleClick = () => {
      if (doc.file_type === "website") {
        window.open(doc.cloudinary_url, "_blank");
      } else {
        onView(doc);
      }
    };

    return (
      <div 
        className={`doc-card ${doc.file_type === "website" ? "doc-card-website" : ""}`}
        onClick={handleClick}
        draggable
        onDragStart={handleDragStart}
        title={doc.file_type === "website" ? `Tiêu đề: ${doc.title}` : ""}
      >
      <div className="doc-card-thumb" style={doc.file_type === "image" ? { padding: 0 } : {}}>
        {doc.file_type === "image" ? (
          <img 
            src={doc.cloudinary_url} 
            alt={doc.title} 
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px 8px 0 0" }} 
          />
        ) : (
          <>
            <span className="doc-card-icon">{TYPE_ICONS[doc.file_type]}</span>
            <span className={`badge badge-${doc.file_type}`}>
              {TYPE_LABELS[doc.file_type]}
            </span>
          </>
        )}
      </div>
      <div className="doc-card-body">
        <h3 className="doc-card-title">
          {doc.file_type === "website" ? doc.cloudinary_url : doc.title}
        </h3>
        {doc.description && (
          <p className="doc-card-desc">{doc.description}</p>
        )}
        <p className="doc-card-date">📅 {formatDate(doc.created_at)}</p>
      </div>
      <div className="doc-card-actions" onClick={(e) => e.stopPropagation()}>
        {doc.file_type !== "website" && (
          <button className="btn-icon" title="Xem" onClick={() => onView(doc)}>👁️</button>
        )}
        {doc.file_type !== "website" && (
          <a
            href={getBaseDownloadUrl()}
            onClick={handleDownload}
            className="btn-icon"
            title="Tải về"
          >
            📥
          </a>
        )}
        <button className="btn-icon" title="Đổi tên / Sửa" onClick={() => onEdit(doc)}>✏️</button>
        <button className="btn-icon" title="Xóa" onClick={() => onDelete(doc)}>🗑️</button>
      </div>
    </div>
  );
}
