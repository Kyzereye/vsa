function Hero() {
  const handleContactClick = (e) => {
    e.preventDefault();
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1>Veterans Sportsmens Association</h1>
        <p>Veterans Serving Veterans</p>
        <a href="#contact" className="cta-button" onClick={handleContactClick}>
          Get Involved
        </a>
      </div>
    </section>
  );
}

export default Hero;
