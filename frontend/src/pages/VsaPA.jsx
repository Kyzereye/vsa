import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Events from "../components/Events";

function VsaPA() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero - same VSA style */}
        <section className="hero" id="home">
          <div className="hero-content">
            <h1>VSA PA (PENNSYLVANIA)</h1>
            <p>Veterans Serving Veterans in the Poconos</p>
            <button
              type="button"
              className="cta-button"
              onClick={() => document.querySelector("#events")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Events
            </button>
          </div>
        </section>

        {/* Events - from API */}
        <Events
          eventType="vsaPA"
          sectionTitle="Upcoming VSA-PA Events"
          pastEventsLink="/vsa-pa-past-events"
          pastEventsLabel="View past VSA-PA events"
        />

        {/* About VSA-PA */}
        <section id="about" style={{ background: "var(--light-gray)" }}>
          <div className="container">
            <h2 className="section-title">VSA In Pennsylvania (VSA-PA)</h2>
            <div className="about-content">
              <p>
                Starting in 2024, the Veterans Sportsmens Association started a new VSA Chapter for the State of Pennsylvania in the Poconos region. Meeting locations, social events, training and shooting events will be listed on the PA Chapter page.
              </p>
            </div>
          </div>
        </section>

        {/* American Legion Post 851 */}
        <section id="programs">
          <div className="container">
            <h2 className="section-title">American Legion Post 851</h2>
            <div className="card-grid">
              <div className="card">
                <h3>Meeting Location</h3>
                <p>
                  The new Pennsylvania (VSA PA) Chapter of the VSA will use the American Legion Post 851 in Dingmans Ferry PA for meetings and events.
                </p>
                <p>
                  <strong>American Legion Post 851</strong>
                  <br />
                  107 Ball Park Rd, Dingmans Ferry, PA 18328
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NRA Training at Tommy Gun Warehouse */}
        <section id="news" style={{ background: "var(--light-gray)" }}>
          <div className="container">
            <h2 className="section-title">NRA Training at Tommy Gun Warehouse</h2>
            <div className="about-content">
              <p>
                The Veterans Sportsmens Association has teamed up with firearms manufacturer Kahr Arms to provide NRA Training Courses at their Tommy Gun Warehouse facility in Greeley PA. These NRA Basic and Instructor Level Courses are open to the public and listed on the NRA Training Website.
              </p>
              <p>
                Special discounts are available for Law Enforcement Personnel (Active or Retired), as well as for Active Duty, Guard and Reserve Military Members and Veterans.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact">
          <div className="container">
            <h2 className="section-title">Contact VSA-PA</h2>
            <div className="contact-grid">
              <div className="contact-card">
                <h3>Part of VSA</h3>
                <p>VSA-PA is a chapter of the Veterans Sportsmens Association.</p>
                <p>
                  <Link to="/">Back to VSA Home</Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default VsaPA;
