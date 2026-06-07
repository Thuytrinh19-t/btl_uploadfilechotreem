import React from "react";

export default function DocumentViewer({ doc, onClose }) {
  if (!doc) return null;

  const renderContent = () => {
    const fileUrl = doc.cloudinary_url || doc.drive_url;
    
    switch (doc.file_type) {
      case "pdf": {
        const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
        return (
          <div className="viewer-pdf">
            <iframe
              src={googleDocsUrl}
              title={doc.title}
              width="100%"
              height="100%"
              style={{ border: "none", minHeight: "70vh", width: "100%", borderRadius: "8px" }}
            />
          </div>
        );
      }
      case "video":
        return (
          <div className="viewer-video">
            <video
              key={doc.id}
              controls
              autoPlay={false}
              style={{ width: "100%", maxHeight: "70vh", borderRadius: "8px", background: "#000" }}
            >
              <source src={fileUrl} />
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          </div>
        );
      case "mp3":
        return (
          <div className="viewer-audio">
            <div className="audio-art" style={{ fontSize: "60px", textAlign: "center", margin: "20px 0" }}>🎵</div>
            <p className="audio-title" style={{ fontWeight: "bold", textAlign: "center" }}>{doc.title}</p>
            {doc.description && <p className="audio-desc" style={{ textAlign: "center", color: "#666" }}>{doc.description}</p>}
            <audio key={doc.id} controls style={{ width: "100%", marginTop: "20px" }}>
              <source src={fileUrl} type="audio/mpeg" />
              Trình duyệt của bạn không hỗ trợ audio.
            </audio>
          </div>
        );
      case "image": {
        // If it's a Google Drive link, use the UC endpoint to get a direct image link
        const finalUrl = fileUrl.includes("drive.google.com") 
          ? fileUrl.replace("file/d/", "uc?id=").replace("/view?usp=sharing", "").replace("/view", "")
          : fileUrl;
          
        return (
          <div className="viewer-image" style={{ textAlign: "center" }}>
            <img 
              src={finalUrl} 
              alt={doc.title} 
              style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: "12px", boxShadow: "var(--shadow)" }} 
            />
          </div>
        );
      }
      default:
        return <p>Không thể xem file này.</p>;
    }
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal modal-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "95vh" }}
      >
        <div className="modal-header">
          <h2>🔍 {doc.title}</h2>
          <button className="btn-icon" onClick={onClose} style={{ fontSize: "1.2rem" }}>×</button>
        </div>
        <div className="modal-body" style={{ padding: "16px" }}>
          {renderContent()}
        </div>
        {doc.drive_url && (
          <div className="modal-footer" style={{ justifyContent: "flex-start" }}>
            <a
              href={doc.cloudinary_url || (doc.drive_id ? `https://drive.google.com/uc?export=download&id=${doc.drive_id}` : doc.drive_url?.replace("file/d/", "uc?export=download&id=").replace("/view?usp=sharing", "").replace("/view", ""))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              download
            >
              📥 Tải về máy
            </a>
            <a
              href={doc.drive_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              🔗 Mở trong Google Drive
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
