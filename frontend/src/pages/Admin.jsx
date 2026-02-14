import { useState, useEffect } from "react";
import { formatPhoneDisplay } from "../utils/phone";
import { formatDateDDMMMYYYY } from "../utils/date";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import AdminEvents from "../components/AdminEvents";
import AdminPrograms from "../components/AdminPrograms";
import AdminNews from "../components/AdminNews";
import AdminRegistrations from "../components/AdminRegistrations";
import AdminGallery from "../components/AdminGallery";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchUsers,
  fetchEvents,
  fetchPrograms,
  fetchNews,
  fetchRegistrations,
  fetchGallery,
  uploadGalleryImage,
  deleteGalleryImage,
  updateUser,
  deleteUser,
  createEvent,
  updateEvent,
  deleteEvent,
  createProgram,
  updateProgram,
  deleteProgram,
  createNews,
  updateNews,
  deleteNews,
} from "../api";

function Admin() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [news, setNews] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", role: "member", status: "active" });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [u, e, p, n, reg] = await Promise.all([
          token ? fetchUsers(token).catch(() => []) : Promise.resolve([]),
          fetchEvents().catch(() => []),
          fetchPrograms().catch(() => []),
          fetchNews().catch(() => []),
          token ? fetchRegistrations(token).catch(() => []) : Promise.resolve([]),
        ]);
        setUsers(u);
        setEvents(e.map((ev) => ({ ...ev, status: ev.eventType || "vsa" })));
        setPrograms(p);
        setNews(n);
        setRegistrations(reg);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    });
  };

  const handleCancel = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", phone: "", role: "member", status: "active" });
  };

  const handleSave = async (userId) => {
    if (!token) return;
    try {
      const data = { name: formData.name, email: formData.email, phone: formData.phone, role: formData.role, status: formData.status };
      await updateUser(userId, data, token);
      setUsers(users.map((user) => (user.id === userId ? { ...user, ...formData } : user)));
      handleCancel();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!token || !window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId, token);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Events handlers
  const handleEventUpdate = async (id, data) => {
    if (!token) return;
    try {
      const payload = {
        date: data.date,
        title: data.title,
        location: data.location,
        address: data.address || null,
        slug: data.slug || null,
        eventType: data.eventType || (data.status === "shredvets" ? "shredvets" : data.status === "org" ? "org" : "vsa"),
        canceled: data.canceled,
        dateChanged: data.dateChanged,
        locationChanged: data.locationChanged,
      };
      const res = await updateEvent(id, payload, token);
      setEvents(events.map((event) => (event.id === id ? { ...event, ...res.event } : event)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEventAdd = async (data) => {
    if (!token) return;
    try {
      const payload = {
        date: data.date,
        title: data.title,
        location: data.location,
        address: data.address || null,
        slug: data.slug || null,
        eventType: data.eventType || (data.status === "shredvets" ? "shredvets" : data.status === "org" ? "org" : "vsa"),
        canceled: data.canceled,
        dateChanged: data.dateChanged,
        locationChanged: data.locationChanged,
      };
      const res = await createEvent(payload, token);
      const newEvent = { ...res.event, status: res.event.eventType || "vsa", eventType: res.event.eventType };
      setEvents([...events, newEvent]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEventDelete = async (id) => {
    if (!token || !window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id, token);
      setEvents(events.filter((event) => event.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Programs handlers
  const handleProgramUpdate = async (id, data) => {
    if (!token) return;
    try {
      const res = await updateProgram(id, data, token);
      setPrograms(programs.map((program) => (program.id === id ? res.program : program)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProgramAdd = async (data) => {
    if (!token) return;
    try {
      const res = await createProgram(data, token);
      setPrograms([...programs, res.program]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProgramDelete = async (id) => {
    if (!token || !window.confirm("Are you sure you want to delete this program?")) return;
    try {
      await deleteProgram(id, token);
      setPrograms(programs.filter((program) => program.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // News handlers
  const handleNewsUpdate = async (id, data) => {
    if (!token) return;
    try {
      const res = await updateNews(id, data, token);
      setNews(news.map((item) => (item.id === id ? res.news : item)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNewsAdd = async (data) => {
    if (!token) return;
    try {
      const res = await createNews(data, token);
      setNews([...news, res.news]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNewsDelete = async (id) => {
    if (!token || !window.confirm("Are you sure you want to delete this news item?")) return;
    try {
      await deleteNews(id, token);
      setNews(news.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Nav />
      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <h1>Admin Panel</h1>
            <p>Manage users and content</p>
          </div>
        </section>

        <section>
          <div className="container">
            {error && (
              <div className="auth-error" style={{ marginBottom: "1rem" }}>
                {error}
                <button type="button" onClick={() => setError(null)} style={{ marginLeft: "0.5rem" }} aria-label="Dismiss">×</button>
              </div>
            )}
            {loading ? (
              <p style={{ textAlign: "center", color: "var(--text-gray)" }}>Loading...</p>
            ) : (
            <>
            <div className="admin-tabs">
              <button
                type="button"
                className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                Users
              </button>
              <button
                type="button"
                className={`admin-tab ${activeTab === "events" ? "active" : ""}`}
                onClick={() => setActiveTab("events")}
              >
                Events
              </button>
              <button
                type="button"
                className={`admin-tab ${activeTab === "programs" ? "active" : ""}`}
                onClick={() => setActiveTab("programs")}
              >
                Programs
              </button>
              <button
                type="button"
                className={`admin-tab ${activeTab === "news" ? "active" : ""}`}
                onClick={() => setActiveTab("news")}
              >
                News
              </button>
              <button
                type="button"
                className={`admin-tab ${activeTab === "registrations" ? "active" : ""}`}
                onClick={() => setActiveTab("registrations")}
              >
                Registered
              </button>
              <button
                type="button"
                className={`admin-tab ${activeTab === "gallery" ? "active" : ""}`}
                onClick={() => setActiveTab("gallery")}
              >
                Gallery
              </button>
            </div>

            {activeTab === "users" && (
              <>
                <h2 className="section-title">User Management</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      {editingUser === user.id ? (
                        <>
                          <td>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="admin-input"
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="admin-input"
                            />
                          </td>
                          <td>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="admin-input"
                            />
                          </td>
                          <td>
                            <select
                              name="role"
                              value={formData.role}
                              onChange={handleChange}
                              className="admin-select"
                            >
                              <option value="member">Member</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td>
                            <select
                              name="status"
                              value={formData.status}
                              onChange={handleChange}
                              className="admin-select"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </td>
                          <td>{user.joinDate}</td>
                          <td>
                            <div className="admin-actions">
                              <button
                                type="button"
                                className="admin-btn admin-btn-save"
                                onClick={() => handleSave(user.id)}
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
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{formatPhoneDisplay(user.phone)}</td>
                          <td>
                            <span className={`admin-badge admin-badge-${user.role}`}>{user.role}</span>
                          </td>
                          <td>
                            <span className={`admin-badge admin-badge-${user.status}`}>{user.status}</span>
                          </td>
                          <td>{formatDateDDMMMYYYY(user.joinDate)}</td>
                          <td>
                            <div className="admin-actions">
                              <button
                                type="button"
                                className="admin-btn admin-btn-edit"
                                onClick={() => handleEdit(user)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="admin-btn admin-btn-delete"
                                onClick={() => handleDelete(user.id)}
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
              </>
            )}

            {activeTab === "events" && (
              <AdminEvents
                events={events}
                onUpdate={handleEventUpdate}
                onAdd={handleEventAdd}
                onDelete={handleEventDelete}
              />
            )}

            {activeTab === "programs" && (
              <AdminPrograms
                programs={programs}
                onUpdate={handleProgramUpdate}
                onAdd={handleProgramAdd}
                onDelete={handleProgramDelete}
              />
            )}

            {activeTab === "news" && (
              <AdminNews
                news={news}
                onUpdate={handleNewsUpdate}
                onAdd={handleNewsAdd}
                onDelete={handleNewsDelete}
              />
            )}

            {activeTab === "registrations" && (
              <>
                <h2 className="section-title">Event Registrations</h2>
                <p style={{ color: "var(--text-gray)", marginBottom: "1rem" }}>
                  Who signed up for which event. Name and contact info from the registration form.
                </p>
                <AdminRegistrations registrations={registrations} events={events} />
              </>
            )}

            {activeTab === "gallery" && (
              <>
                <h2 className="section-title">Photo Gallery</h2>
                <p style={{ color: "var(--text-gray)", marginBottom: "1rem" }}>
                  Add images to the gallery. Images are stored in <code>uploads/gallery</code>. You can assign an event to each image.
                </p>
                <AdminGallery
                  gallery={gallery}
                  events={events}
                  onUpload={async (formData) => {
                    if (!token) return;
                    const { image } = await uploadGalleryImage(formData, token);
                    setGallery((prev) => [...prev, image]);
                  }}
                  onDelete={async (id) => {
                    if (!token) return;
                    await deleteGalleryImage(id, token);
                    setGallery((prev) => prev.filter((img) => img.id !== id));
                  }}
                />
              </>
            )}
            </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Admin;
