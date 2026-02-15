import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchGallery, galleryImageUrl } from "../api";

function Gallery({ limit }) {
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGallery()
      .then(setImages)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const displayImages = limit ? images.slice(0, limit) : images;
  const hasMore = limit != null && images.length > limit;

  return (
    <>
      <section id="gallery">
        <div className="container">
          <h2 className="section-title">Photo Gallery</h2>
          {error && <p className="error-message">{error}</p>}
          {loading ? (
            <p style={{ color: "var(--text-gray)" }}>Loading gallery…</p>
          ) : (
            <div className="gallery">
              {displayImages.map((img) => {
                const src = galleryImageUrl(img.url);
                return (
                  <img
                    key={img.id}
                    src={src}
                    alt={img.altText || "Gallery"}
                    loading="lazy"
                    onClick={() => setLightboxSrc(src)}
                  />
                );
              })}
            </div>
          )}
          {!loading && hasMore && (
            <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <Link to="/gallery" className="cta-button" style={{ background: "var(--dark-gray)" }}>
                View full gallery
              </Link>
            </p>
          )}
        </div>
      </section>

      {lightboxSrc && (
        <div
          className="lightbox"
          onClick={() => setLightboxSrc(null)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Escape" && setLightboxSrc(null)}
          aria-label="Close lightbox"
        >
          <img
            src={lightboxSrc}
            alt="Enlarged view"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default Gallery;
