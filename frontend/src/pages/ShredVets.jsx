import { useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import RegistrationDialog from "../components/RegistrationDialog";
import Events from "../components/Events";

function ShredVets() {
  const [registrationOpen, setRegistrationOpen] = useState(false);

  return (
    <>
      <Nav />
      <main>
        {/* Hero - same VSA style */}
        <section className="hero" id="home">
          <div className="hero-content">
            <h1>Welcome to SHREDVETS</h1>
            <p>Join our veterans on the mountains this season</p>
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
          eventType="shredvets"
          sectionTitle="Upcoming ShredVets Events"
          pastEventsLink="/shredvets-past-events"
          pastEventsLabel="View past ShredVets events"
        />

        {/* Season highlight - card style */}
        <section style={{ background: "var(--light-gray)" }}>
          <div className="container">
            <h2 className="section-title">The 2026 Season is off to a Great Start</h2>
            <div className="about-content">
              <p>
                Welcome to Shredvets! We invite you to explore and learn more about our Veterans Skiing and Snowboarding Program, our upcoming trips, events and activities. We are always planning something new and exciting, and we hope you'll join us on the Mountains for the 2025 - 2026 Season!
              </p>
              <p>
                ShredVets provides local veterans with free participation in skiing and snowboarding at several local Mountain ski areas, and facilitates newcomers to snow sports with free equipment and instruction. Veterans in our program ski, ride and learn with their fellow veterans, enjoying the outdoors and healthy activity during a time of year that can be otherwise isolating and challenging for Veterans.
              </p>
            </div>
          </div>
        </section>

        {/* Vets Who Rock - card */}
        <section>
          <div className="container">
            <h2 className="section-title">Vets Who Rock - 101.5 WPDH</h2>
            <div className="card-grid">
              <div className="card">
                <h3>SHREDVETS - DECEMBER 2025 WINNER</h3>
                <p>
                  Every month, 101.5 WPDH, MHA of Dutchess County and Mid-Hudson Pump shine a spotlight on a different veteran organization and donate $500 to help them continue their work. This month, we've selected Breezy Grenier and her organization, ShredVets.
                </p>
                <p>
                  ShredVets is an organization that provides Hudson Valley veterans with free participation in skiing and snowboarding at several local Mountain ski areas.
                </p>
                <p>
                  <a href="https://wpdh.com/shredvets-vets-who-rock/" target="_blank" rel="noopener noreferrer">
                    Read More: ShredVets Receives $500 Donation From WPDH Vets Who Rock
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Hudson Valley Ski Club - card */}
        <section style={{ background: "var(--light-gray)" }}>
          <div className="container">
            <h2 className="section-title">Hudson Valley Ski Club</h2>
            <div className="about-content">
              <p>
                The Veterans Sportsmens Association and ShredVets have teamed up with the Hudson Valley Ski Club to promote sporting and social activities for Veterans of the Hudson Valley and Beyond!
              </p>
            </div>
            <div className="card-grid">
              <div className="card">
                <h3>Coming in February 2026</h3>
                <p>
                  Our much anticipated 3rd Annual partnered event between ShredVets and Guardian Revival at Thunder Ridge Ski Area. Tentative date: Friday 20 February 2026.
                </p>
                <p>
                  Calling all Military, Veterans, First Responders, and their immediate family (all ages welcome)! Join us for a free snow sports day on Thunder Ridge with your family — ski or snowboard (free equipment & lessons available too!).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Mountains Are Calling - hero-style block */}
        <section>
          <div className="container">
            <h2 className="section-title">The Mountains Are Calling...</h2>
            <p className="about-content" style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--primary-blue)" }}>
              ...You must answer the call
            </p>
          </div>
        </section>

        {/* Competitive Pricing - card */}
        <section style={{ background: "var(--light-gray)" }}>
          <div className="container">
            <h2 className="section-title">Competitive Pricing</h2>
            <div className="card-grid">
              <div className="card">
                <h3>Free for Veterans</h3>
                <p>
                  Due to the very generous support we receive from several local ski mountains, most ski and snowboarding passes are provided for FREE to ShredVets participants during our scheduled ski days.
                </p>
                <p>
                  Additionally, FREE rental equipment is also available if coordinated in advance. Please check our schedule for upcoming ski events and contact us about our rental program. Thanks!
                </p>
                <p style={{ fontWeight: 600, color: "var(--primary-red)" }}>
                  Most ShredVets events are FREE for Veterans!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact - same style as VSA Contact */}
        <section id="contact">
          <div className="container">
            <h2 className="section-title">Contact ShredVets</h2>
            <div className="contact-grid">
              <div className="contact-card">
                <h3>Email</h3>
                <p>
                  <a href="mailto:ShredVets@gmail.com">ShredVets@gmail.com</a>
                </p>
              </div>
              <div className="contact-card">
                <h3>Part of VSA</h3>
                <p>ShredVets is a program of the Veterans Sportsmens Association.</p>
                <p>
                  <Link to="/">Back to VSA Home</Link>
                </p>
              </div>
        </div>
      </div>
    </section>
      </main>
      <Footer />
      <RegistrationDialog
        open={registrationOpen}
        onClose={() => setRegistrationOpen(false)}
      />
    </>
  );
}

export default ShredVets;
