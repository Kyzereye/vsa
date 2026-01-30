const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchUsers(token) {
  const res = await fetch(`${API_BASE}/users`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to fetch users");
  const data = await res.json();
  return data.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    status: u.status,
    joinDate: u.joinDate,
  }));
}

export async function updateUser(id, data, token) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to update user");
  return res.json();
}

export async function deleteUser(id, token) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to delete user");
}

export async function fetchEvents(eventType) {
  const url = eventType ? `${API_BASE}/events?event_type=${eventType}` : `${API_BASE}/events`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch events");
  const data = await res.json();
  return data.map((e) => ({
    id: e.id,
    date: e.date,
    title: e.title,
    location: e.location,
    address: e.address ?? null,
    slug: e.slug,
    eventType: e.eventType,
    canceled: e.canceled,
    dateChanged: e.dateChanged,
    locationChanged: e.locationChanged,
    originalDate: e.originalDate,
    originalLocation: e.originalLocation,
    originalAddress: e.originalAddress ?? null,
  }));
}

export async function fetchEventBySlug(slug) {
  const res = await fetch(`${API_BASE}/events/by-slug/${encodeURIComponent(slug)}`);
  if (!res.ok) return null;
  const e = await res.json();
  return {
    id: e.id,
    slug: e.slug,
    date: e.date,
    title: e.title,
    location: e.location,
    address: e.address ?? null,
    subtitle: e.subtitle,
    details: e.details || [],
    canceled: e.canceled,
    dateChanged: e.dateChanged,
    locationChanged: e.locationChanged,
    eventType: e.eventType,
  };
}

export async function fetchEventById(id) {
  const res = await fetch(`${API_BASE}/events/${id}`);
  if (!res.ok) return null;
  const e = await res.json();
  return {
    id: e.id,
    slug: e.slug,
    date: e.date,
    title: e.title,
    location: e.location,
    address: e.address ?? null,
    subtitle: undefined,
    details: [],
    canceled: e.canceled,
    dateChanged: e.dateChanged,
    locationChanged: e.locationChanged,
    eventType: e.eventType,
  };
}

export async function createRegistration({ eventId, name, email, phone, message }) {
  const res = await fetch(`${API_BASE}/registrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId, name, email, phone: phone || null, message: message || null }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to submit registration");
  }
}

export async function fetchRegistrations(token) {
  const res = await fetch(`${API_BASE}/registrations`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to fetch registrations");
  const data = await res.json();
  return data.map((r) => ({
    id: r.id,
    eventId: r.eventId,
    eventTitle: r.eventTitle,
    eventDate: r.eventDate,
    eventSlug: r.eventSlug,
    userId: r.userId,
    name: r.name,
    email: r.email,
    phone: r.phone,
    message: r.message,
    registrationDate: r.registrationDate,
  }));
}

export async function fetchPrograms() {
  const res = await fetch(`${API_BASE}/programs`);
  if (!res.ok) throw new Error("Failed to fetch programs");
  return res.json();
}

export async function fetchNews() {
  const res = await fetch(`${API_BASE}/news`);
  if (!res.ok) throw new Error("Failed to fetch news");
  const data = await res.json();
  return data.map((n) => ({ id: n.id, title: n.title, description: n.description }));
}

// Admin mutations (require auth)
export async function createEvent(data, token) {
  const res = await fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to create event");
  return res.json();
}

export async function updateEvent(id, data, token) {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to update event");
  return res.json();
}

export async function deleteEvent(id, token) {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to delete event");
}

export async function createProgram(data, token) {
  const res = await fetch(`${API_BASE}/programs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to create program");
  return res.json();
}

export async function updateProgram(id, data, token) {
  const res = await fetch(`${API_BASE}/programs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to update program");
  return res.json();
}

export async function deleteProgram(id, token) {
  const res = await fetch(`${API_BASE}/programs/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to delete program");
}

export async function createNews(data, token) {
  const res = await fetch(`${API_BASE}/news`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to create news");
  return res.json();
}

export async function updateNews(id, data, token) {
  const res = await fetch(`${API_BASE}/news/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to update news");
  return res.json();
}

export async function deleteNews(id, token) {
  const res = await fetch(`${API_BASE}/news/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to delete news");
}
