import PageLayout from "../components/PageLayout";
import Gallery from "../components/Gallery";

function GalleryPage() {
  return (
    <PageLayout title="Photo Gallery" subtitle="Photos from VSA events and activities">
      <Gallery />
    </PageLayout>
  );
}

export default GalleryPage;
