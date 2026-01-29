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

function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Programs />
        <Events />
        <News />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default Home;
