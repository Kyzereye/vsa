import { useState } from "react";

function AdminPrograms({ programs, onUpdate, onAdd, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    url: "",
  });

  const handleEdit = (program) => {
    setEditingId(program.id);
    setFormData({
      title: program.title,
      description: program.description,
      link: program.link || "",
      url: program.url || "",
    });
    setShowAddForm(false);
  };

  const handleAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      link: "",
      url: "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      title: "",
      description: "",
      link: "",
      url: "",
    });
  };

  const handleSave = () => {
    const programData = { ...formData };
    if (editingId) {
      onUpdate(editingId, programData);
    } else {
      onAdd(programData);
    }
    handleCancel();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      onDelete(id);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h3 style={{ margin: 0 }}>Programs</h3>
        <button type="button" className="admin-btn admin-btn-save" onClick={handleAdd}>
          + Add Program
        </button>
      </div>

      {showAddForm && (
        <div className="admin-form-card">
          <h4>Add New Program</h4>
          <div className="admin-form-grid">
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="admin-input"
                placeholder="Program Title"
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="admin-input"
                rows={4}
                placeholder="Program description..."
              />
            </div>
            <div>
              <label>Internal Link (e.g., /shredvets)</label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="admin-input"
                placeholder="/shredvets"
              />
            </div>
            <div>
              <label>External URL</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="admin-input"
                placeholder="https://example.com"
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button type="button" className="admin-btn admin-btn-save" onClick={handleSave}>
              Save
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
              <th>Title</th>
              <th>Description</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id}>
                {editingId === program.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="admin-input"
                      />
                    </td>
                    <td>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="admin-input"
                        rows={3}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        className="admin-input"
                        placeholder="Internal link"
                      />
                      <input
                        type="url"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        className="admin-input"
                        style={{ marginTop: "0.5rem" }}
                        placeholder="External URL"
                      />
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn-save"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-cancel"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{program.title}</td>
                    <td>{program.description.substring(0, 100)}...</td>
                    <td>
                      {program.link && <div>Internal: {program.link}</div>}
                      {program.url && <div>External: {program.url}</div>}
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn-edit"
                          onClick={() => handleEdit(program)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-delete"
                          onClick={() => handleDelete(program.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPrograms;
