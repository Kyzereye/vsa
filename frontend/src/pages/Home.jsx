import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Nav,
  Hero,
  About,
  Programs,
  Events,
  News,
  Gallery,
  Contact,
  Footer,
} from "../components";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        const t = setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        return () => clearTimeout(t);
      }
    }
  }, [location.hash]);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Events pastEventsLink="/past-events" pastEventsLabel="View past VSA events" />
        <About teaser />
        <Programs limit={2} />
        {isAuthenticated() && <News limit={2} />}
        <Gallery limit={6} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default Home;
