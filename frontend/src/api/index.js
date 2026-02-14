const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3333/api";

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

export async function requestPasswordReset(email) {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to send reset email");
  return data;
}

export async function resetPassword(token, newPassword) {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to reset password");
  return data;
}

export async function fetchEvents(eventType, options = {}) {
  const params = new URLSearchParams();
  if (eventType) params.set("event_type", eventType);
  if (options.past) params.set("time", "past");
  const url = `${API_BASE}/events${params.toString() ? `?${params.toString()}` : ""}`;
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

export async function createRegistration({ eventId, name, email, phone, message }, token = null) {
  const res = await fetch(`${API_BASE}/registrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ eventId, name, email, phone: phone || null, message: message || null }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to submit registration");
  }
  return res.json();
}

export async function fetchMyRegistrations(token) {
  const res = await fetch(`${API_BASE}/registrations/mine`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error("Failed to fetch your registrations");
  const data = await res.json();
  return data.map((r) => ({
    id: r.id,
    eventId: r.eventId,
    eventTitle: r.eventTitle,
    eventDate: r.eventDate,
    eventSlug: r.eventSlug,
    eventLocation: r.eventLocation,
    eventAddress: r.eventAddress ?? null,
    registrationDate: r.registrationDate,
  }));
}

export async function deleteRegistration(id, token) {
  const res = await fetch(`${API_BASE}/registrations/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to cancel registration");
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

// Gallery (public list; upload/delete require auth)
const GALLERY_BASE = `${API_BASE}/gallery`;
const UPLOADS_BASE = `${API_BASE}/uploads`;

export function galleryImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${UPLOADS_BASE}/${url}`;
}

export async function fetchGallery() {
  const res = await fetch(GALLERY_BASE);
  if (!res.ok) throw new Error("Failed to fetch gallery");
  const data = await res.json();
  return data.map((g) => ({
    id: g.id,
    url: g.url,
    altText: g.altText,
    caption: g.caption,
    displayOrder: g.displayOrder,
    eventId: g.eventId,
    eventTitle: g.eventTitle,
    createdAt: g.createdAt,
  }));
}

export async function uploadGalleryImage(formData, token) {
  const res = await fetch(GALLERY_BASE, {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data.error ? `${data.message}: ${data.error}` : (data.message || "Failed to upload image");
    throw new Error(msg);
  }
  return res.json();
}

export async function deleteGalleryImage(id, token) {
  const res = await fetch(`${GALLERY_BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to delete image");
  }
}
