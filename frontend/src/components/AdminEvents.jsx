import { useState } from "react";
import { formatEventDateDisplay } from "../utils/date";

function AdminEvents({ events = [], onUpdate, onAdd, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    title: "",
    location: "",
    address: "",
    slug: "",
    eventType: "vsa",
    canceled: false,
    dateChanged: false,
    locationChanged: false,
  });

  const handleEdit = (event) => {
    setEditingId(event.id);
    setFormData({
      date: event.date ? String(event.date).slice(0, 10) : "",
      title: event.title,
      location: event.location,
      address: event.address || "",
      slug: event.slug || "",
      eventType: event.eventType || event.status || "vsaNY",
      canceled: event.canceled || false,
      dateChanged: event.dateChanged || false,
      locationChanged: event.locationChanged || false,
    });
    setShowAddForm(false);
  };

  const handleAdd = () => {
    setShowAddForm(true);
    setEditingId(null);
    setFormData({
      date: "",
      title: "",
      location: "",
      address: "",
      slug: "",
      eventType: "vsa",
      canceled: false,
      dateChanged: false,
      locationChanged: false,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      date: "",
      title: "",
      location: "",
      address: "",
      slug: "",
      eventType: "vsa",
      canceled: false,
      dateChanged: false,
      locationChanged: false,
    });
  };

  const handleSave = () => {
    if (editingId) {
      const originalEvent = events.find((e) => e.id === editingId);
      const origDate = originalEvent?.date ? String(originalEvent.date).slice(0, 10) : "";
      onUpdate(editingId, {
        ...formData,
        dateChanged: formData.date !== origDate,
        locationChanged:
          formData.location !== (originalEvent?.location ?? "") ||
          (formData.address ?? "") !== (originalEvent?.address ?? ""),
      });
    } else {
      onAdd({
        ...formData,
        dateChanged: false,
        locationChanged: false,
      });
    }
    handleCancel();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDelete = (id) => {
    onDelete(id);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h3 style={{ margin: 0 }}>Events</h3>
        <button type="button" className="admin-btn admin-btn-save" onClick={handleAdd}>
          + Add Event
        </button>
      </div>

      {showAddForm && (
        <div className="admin-form-card">
          <h4>Add New Event</h4>
          <div className="admin-form-grid">
            <div>
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="admin-input"
                required
              />
            </div>
            <div>
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="admin-input"
                placeholder="Event Title"
              />
            </div>
            <div>
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="admin-input"
                placeholder="Venue or place name"
              />
            </div>
            <div>
              <label>Address (optional)</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="admin-input"
                placeholder="Street address"
              />
            </div>
            <div>
              <label>Event type *</label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="admin-input"
              >
                <option value="vsaNY">VSA NY (home page)</option>
                <option value="vsaPA">VSA PA</option>
                <option value="shredvets">ShredVets</option>
                <option value="trainingNY">Training NY</option>
                <option value="trainingPA">Training PA</option>
                <option value="orgNY">Org meeting NY</option>
                <option value="orgPA">Org meeting PA</option>
              </select>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="canceled"
                  checked={formData.canceled}
                  onChange={handleChange}
                />
                Event Canceled
              </label>
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
              <th>Date</th>
              <th>Title</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                {editingId === event.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="admin-input"
                      />
                      {formData.dateChanged && (
                        <div className="admin-alert admin-alert-changed">Date Changed</div>
                      )}
                    </td>
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
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="admin-input"
                        placeholder="Location"
                      />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="admin-input"
                        placeholder="Address"
                        style={{ marginTop: "0.25rem" }}
                      />
                      {formData.locationChanged && (
                        <div className="admin-alert admin-alert-changed">Location Changed</div>
                      )}
                    </td>
                    <td>
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        className="admin-input"
                        style={{ minWidth: "8rem" }}
                      >
                        <option value="vsa">VSA only</option>
                        <option value="shredvets">ShredVets</option>
                        <option value="org">Org meeting</option>
                        <option value="training">Training</option>
                      </select>
                    </td>
                    <td>
                      <label>
                        <input
                          type="checkbox"
                          name="canceled"
                          checked={formData.canceled}
                          onChange={handleChange}
                        />
                        Canceled
                      </label>
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
                    <td>
                      {formatEventDateDisplay(event.date)}
                      {event.dateChanged && (
                        <div className="admin-alert admin-alert-changed">Date Changed</div>
                      )}
                    </td>
                    <td>{event.title}</td>
                    <td>
                      <div>{event.location}</div>
                      {event.address && <div style={{ fontSize: "0.9rem", color: "var(--text-gray)" }}>{event.address}</div>}
                      {event.locationChanged && (
                        <div className="admin-alert admin-alert-changed">Location Changed</div>
                      )}
                    </td>
                    <td>
                      {({ vsaNY: "VSA NY", vsaPA: "VSA PA", shredvets: "ShredVets", trainingNY: "Training NY", trainingPA: "Training PA", orgNY: "Org NY", orgPA: "Org PA" }[event.eventType || event.status] || "VSA NY")}
                    </td>
                    <td>
                      {event.canceled && (
                        <span className="admin-badge admin-badge-canceled">Canceled</span>
                      )}
                      {event.dateChanged && (
                        <span className="admin-badge admin-badge-changed">Date Changed</span>
                      )}
                      {event.locationChanged && (
                        <span className="admin-badge admin-badge-changed">Location Changed</span>
                      )}
                      {!event.canceled && !event.dateChanged && !event.locationChanged && (
                        <span className="admin-badge admin-badge-active">Active</span>
                      )}
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn-edit"
                          onClick={() => handleEdit(event)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-delete"
                          onClick={() => handleDelete(event.id)}
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

export default AdminEvents;
