import { useState, useRef } from "react";
import { galleryImageUrl } from "../api";

function AdminGallery({ gallery, events, onUpload, onDelete }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [formData, setFormData] = useState({
    eventId: "",
    altText: "",
    caption: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleAdd = () => {
    setShowAddForm(true);
    setUploadError(null);
    setFormData({ eventId: "", altText: "", caption: "" });
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setUploadError(null);
    setFormData({ eventId: "", altText: "", caption: "" });
    setSelectedFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select an image file.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("image", selectedFile);
      if (formData.eventId) fd.append("eventId", formData.eventId);
      if (formData.altText) fd.append("altText", formData.altText);
      if (formData.caption) fd.append("caption", formData.caption);
      await onUpload(fd);
      handleCancel();
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      onDelete(id);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h3 style={{ margin: 0 }}>Photo Gallery</h3>
        <button type="button" className="admin-btn admin-btn-save" onClick={handleAdd}>
          + Add Image
        </button>
      </div>

      {showAddForm && (
        <div className="admin-form-card">
          <h4>Add Image to Gallery</h4>
          <div className="admin-form-grid">
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Image file *</label>
              <div className="admin-file-wrap">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  className="admin-file-input"
                  aria-label="Choose image file"
                />
                <button type="button" className="admin-btn admin-btn-edit" onClick={() => fileInputRef.current?.click()}>
                  Choose file
                </button>
                {selectedFile && <span className="admin-file-name">{selectedFile.name}</span>}
              </div>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Event *</label>
              <select
                name="eventId"
                value={formData.eventId}
                onChange={handleChange}
                className="admin-select"
                required
              >
                <option value="">Web Page Image</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} {ev.date ? `(${ev.date})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Alt text (optional)</label>
              <input
                type="text"
                name="altText"
                value={formData.altText}
                onChange={handleChange}
                className="admin-input"
                placeholder="Short description for accessibility"
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Caption (optional)</label>
              <input
                type="text"
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                className="admin-input"
                placeholder="Caption for the image"
              />
            </div>
          </div>
          {uploadError && <p style={{ color: "var(--error)", marginTop: "0.5rem" }}>{uploadError}</p>}
          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-btn admin-btn-save"
              onClick={handleUpload}
              disabled={uploading}
            >
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
            {gallery.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ color: "var(--text-gray)" }}>
                  No images yet. Add one above.
                </td>
              </tr>
            ) : (
              gallery.map((img) => (
                <tr key={img.id}>
                  <td>
                    <img
                      src={galleryImageUrl(img.url)}
                      alt={img.altText || "Gallery"}
                      style={{ maxWidth: 80, maxHeight: 60, objectFit: "cover", borderRadius: 4 }}
                    />
                  </td>
                  <td>{img.eventTitle || "Web Page Image"}</td>
                  <td>
                    {img.altText && <div>{img.altText}</div>}
                    {img.caption && <div style={{ fontSize: "0.9em", color: "var(--text-gray)" }}>{img.caption}</div>}
                    {!img.altText && !img.caption && "—"}
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-delete"
                        onClick={() => handleDelete(img.id)}
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

export default AdminGallery;
