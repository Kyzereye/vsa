import { useState, useRef } from "react";
import { mediaUrl } from "../api";
import { isImage } from "../utils/media";
import ConfirmDialog from "./ConfirmDialog";

const TYPES = [
  { value: "gallery", label: "Gallery" },
  { value: "event", label: "Event" },
  { value: "page", label: "Page" },
  { value: "team", label: "Team" },
  { value: "document", label: "Document" },
];

function AdminMedia({ media, events, onUpload, onDelete }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadType, setUploadType] = useState("gallery");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [formData, setFormData] = useState({ eventId: "", altText: "", caption: "", title: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const fileInputRef = useRef(null);

  const handleAdd = () => {
    setShowAddForm(true);
    setUploadError(null);
    setFormData({ eventId: "", altText: "", caption: "", title: "" });
    setSelectedFile(null);
    setUploadType("gallery");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setUploadError(null);
    setSelectedFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", selectedFile);
      if (formData.eventId) fd.append("eventId", formData.eventId);
      if (formData.altText) fd.append("altText", formData.altText);
      if (formData.caption) fd.append("caption", formData.caption);
      if (formData.title) fd.append("title", formData.title);
      await onUpload(fd, uploadType);
      handleCancel();
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (id) => setDeleteConfirmId(id);
  const handleDeleteConfirm = () => {
    if (deleteConfirmId != null) onDelete(deleteConfirmId);
  };

  return (
    <div>
      <ConfirmDialog
        open={deleteConfirmId != null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteConfirm}
        title="Are you sure?"
        message="This item will be permanently deleted."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h3 style={{ margin: 0 }}>Media Library</h3>
        <button type="button" className="admin-btn admin-btn-save" onClick={handleAdd}>
          + Add Media
        </button>
      </div>

      {showAddForm && (
        <div className="admin-form-card">
          <h4>Upload File</h4>
          <div className="admin-form-grid">
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Type *</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="admin-select"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>File *</label>
              <div className="admin-file-wrap">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={uploadType === "document" ? "application/pdf" : "image/jpeg,image/png,image/gif,image/webp"}
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="admin-file-input"
                  aria-label="Choose file"
                />
                <button type="button" className="admin-btn admin-btn-edit" onClick={() => fileInputRef.current?.click()}>
                  Choose file
                </button>
                {selectedFile && <span className="admin-file-name">{selectedFile.name}</span>}
              </div>
            </div>
            {uploadType === "event" && (
              <div style={{ gridColumn: "1 / -1" }}>
                <label>Event</label>
                <select name="eventId" value={formData.eventId} onChange={handleChange} className="admin-select">
                  <option value="">—</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Alt text / Caption</label>
              <input
                type="text"
                name="altText"
                value={formData.altText}
                onChange={handleChange}
                className="admin-input"
                placeholder="Alt text or caption"
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Caption</label>
              <input
                type="text"
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                className="admin-input"
                placeholder="Caption"
              />
            </div>
            {uploadType === "document" && (
              <div style={{ gridColumn: "1 / -1" }}>
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="admin-input"
                  placeholder="Document title"
                />
              </div>
            )}
          </div>
          {uploadError && <p style={{ color: "var(--error)", marginTop: "0.5rem" }}>{uploadError}</p>}
          <div className="admin-form-actions">
            <button type="button" className="admin-btn admin-btn-save" onClick={handleUpload} disabled={uploading}>
              {uploading ? "Uploading…" : "Upload"}
            </button>
            <button type="button" className="admin-btn admin-btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Event</th>
              <th>Alt / Caption</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {media.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ color: "var(--text-gray)" }}>
                  No images yet. Add one above.
                </td>
              </tr>
            ) : (
              media.map((item) => (
                <tr key={item.id}>
                  <td>
                    {isImage(item) ? (
                      <img
                        src={mediaUrl(item.path)}
                        alt={item.altText || "Gallery"}
                        style={{ maxWidth: 80, maxHeight: 60, objectFit: "cover", borderRadius: 4 }}
                      />
                    ) : (
                      <span style={{ fontSize: "0.85rem", color: "var(--text-gray)" }}>PDF</span>
                    )}
                  </td>
                  <td>{item.eventTitle || "Web Page Image"}</td>
                  <td>
                    {item.altText && <div>{item.altText}</div>}
                    {item.caption && <div style={{ fontSize: "0.9em", color: "var(--text-gray)" }}>{item.caption}</div>}
                    {!item.altText && !item.caption && !item.title && "—"}
                    {item.title && !item.altText && !item.caption && <div>{item.title}</div>}
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-delete"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminMedia;
