import { useState } from "react";
import { GALLERY_IMAGES } from "../data/gallery";

function Gallery() {
  const [lightboxSrc, setLightboxSrc] = useState(null);

  return (
    <>
      <section>
        <div className="container">
          <h2 className="section-title">Photo Gallery</h2>
          <div className="gallery">
            {GALLERY_IMAGES.map(({ id, src, alt }) => (
              <img
                key={id}
                src={src}
                alt={alt}
                loading="lazy"
                onClick={() => setLightboxSrc(src)}
              />
            ))}
          </div>
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
