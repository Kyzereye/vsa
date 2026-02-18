import { useState, useEffect } from "react";
import PageLayout from "../components/PageLayout";
import MediaLibrary from "../components/MediaLibrary";
import AdminMedia from "../components/AdminMedia";
import { useAuth } from "../contexts/AuthContext";
import { fetchMedia, uploadMedia, deleteMedia, fetchEvents } from "../api";

function GalleryPage() {
  const { user, token } = useAuth();
  const [media, setMedia] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchMedia().then(setMedia).catch(() => setMedia([]));
      fetchEvents().then((e) => setEvents(e)).catch(() => setEvents([]));
    }
  }, [user]);

  if (user?.role === "admin") {
    return (
      <PageLayout title="Media Library" subtitle="Manage photos and documents. Add or delete items.">
        <section className="container" style={{ paddingTop: "1rem" }}>
          <AdminMedia
            media={media}
            events={events}
            onUpload={async (formData, type) => {
              if (!token) return;
              const { media: newItem } = await uploadMedia(formData, type, token);
              setMedia((prev) => [...prev, newItem]);
            }}
            onDelete={async (id) => {
              if (!token) return;
              await deleteMedia(id, token);
              setMedia((prev) => prev.filter((m) => m.id !== id));
            }}
          />
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Media Library" subtitle="Photos and documents from VSA events and activities">
      <MediaLibrary />
    </PageLayout>
  );
}

export default GalleryPage;
