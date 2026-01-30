import { useState } from "react";

function AdminEvents({ events = [], onUpdate, onAdd, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    title: "",
    location: "",
    address: "",
    slug: "",
    status: "active",
    canceled: false,
    dateChanged: false,
    locationChanged: false,
    originalDate: "",
    originalLocation: "",
    originalAddress: "",
  });

  const handleEdit = (event) => {
    setEditingId(event.id);
    setFormData({
      date: event.date,
      title: event.title,
      location: event.location,
      address: event.address || "",
      slug: event.slug || "",
      status: event.status || "active",
      canceled: event.canceled || false,
      dateChanged: event.dateChanged || false,
      locationChanged: event.locationChanged || false,
      originalDate: event.originalDate || event.date,
      originalLocation: event.originalLocation || event.location,
      originalAddress: event.originalAddress || event.address || "",
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
      status: "active",
      canceled: false,
      dateChanged: false,
      locationChanged: false,
      originalDate: "",
      originalLocation: "",
      originalAddress: "",
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
      status: "active",
      canceled: false,
      dateChanged: false,
      locationChanged: false,
      originalDate: "",
      originalLocation: "",
      originalAddress: "",
    });
  };

  const handleSave = () => {
    let eventData;
    
    if (editingId) {
      // Editing existing event - check for changes
      const originalEvent = events.find((e) => e.id === editingId);
      const originalDate = formData.originalDate || originalEvent?.date || formData.date;
      const originalLocation = formData.originalLocation || originalEvent?.location || formData.location;
      const originalAddress = formData.originalAddress ?? originalEvent?.address ?? formData.address;
      
      eventData = {
        ...formData,
        originalDate,
        originalLocation,
        originalAddress,
        dateChanged: formData.date !== originalDate,
        locationChanged: (formData.location !== originalLocation) || (formData.address !== originalAddress),
      };
      onUpdate(editingId, eventData);
    } else {
      // Adding new event - no changes yet
      eventData = {
        ...formData,
        originalDate: formData.date,
        originalLocation: formData.location,
        originalAddress: formData.address || null,
        dateChanged: false,
        locationChanged: false,
      };
      onAdd(eventData);
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
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="admin-input"
                placeholder="Sat, Jan 31"
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
              <label>Slug (optional)</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="admin-input"
                placeholder="event-slug"
              />
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
                      <div>
                        <label>
                          <input
                            type="checkbox"
                            name="canceled"
                            checked={formData.canceled}
                            onChange={handleChange}
                          />
                          Canceled
                        </label>
                      </div>
                      <div>
                        <label>
                          <input
                            type="checkbox"
                            name="dateChanged"
                            checked={formData.dateChanged}
                            onChange={handleChange}
                          />
                          Date Changed
                        </label>
                      </div>
                      <div>
                        <label>
                          <input
                            type="checkbox"
                            name="locationChanged"
                            checked={formData.locationChanged}
                            onChange={handleChange}
                          />
                          Location Changed
                        </label>
                      </div>
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
                      {event.date}
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
