import { useState, useEffect } from "react";
import { fetchMedia, mediaUrl } from "../api";
import { isImage } from "../utils/media";

const TYPES = [
  { value: "", label: "All" },
  { value: "gallery", label: "Gallery" },
  { value: "event", label: "Events" },
  { value: "page", label: "Page" },
  { value: "team", label: "Team" },
  { value: "document", label: "Documents" },
];

function MediaLibrary() {
  const [media, setMedia] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMedia(typeFilter || undefined)
      .then(setMedia)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [typeFilter]);

  const images = media.filter(isImage);
  const documents = media.filter((m) => !isImage(m));

  return (
    <section id="media-library">
      <div className="container">
        <h2 className="section-title">Media Library</h2>

        <div className="media-library-tabs">
          {TYPES.map(({ value, label }) => (
            <button
              key={value || "all"}
              type="button"
              className={`media-library-tab ${typeFilter === value ? "active" : ""}`}
              onClick={() => setTypeFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {error && <p style={{ color: "var(--primary-red)" }}>{error}</p>}
        {loading ? (
          <p style={{ color: "var(--text-gray)" }}>Loading…</p>
        ) : media.length === 0 ? (
          <p style={{ color: "var(--text-gray)" }}>No media in this category.</p>
        ) : (
          <>
            {images.length > 0 && (
              <div className="media-library-grid">
                {images.map((item) => (
                  <figure key={item.id} className="media-library-item">
                    <a href={mediaUrl(item.path)} target="_blank" rel="noopener noreferrer">
                      <img
                        src={mediaUrl(item.path)}
                        alt={item.altText || item.caption || "Media"}
                        loading="lazy"
                      />
                    </a>
                    {(item.caption || item.altText) && (
                      <figcaption>{item.caption || item.altText}</figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
            {documents.length > 0 && (
              <ul className="media-library-docs">
                {documents.map((item) => (
                  <li key={item.id}>
                    <a href={mediaUrl(item.path)} download target="_blank" rel="noopener noreferrer">
                      {item.title || item.path?.split("/").pop() || "Document"}
                    </a>
                    {item.caption && <span className="media-library-doc-caption">{item.caption}</span>}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default MediaLibrary;
