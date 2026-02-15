import PageLayout from "../components/PageLayout";
import News from "../components/News";

function NewsPage() {
  return (
    <PageLayout title="Latest News" subtitle="News and updates from the VSA">
      <News />
    </PageLayout>
  );
}

export default NewsPage;
