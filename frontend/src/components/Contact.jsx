function Contact() {
  return (
    <section id="contact">
      <div className="container">
        <h2 className="section-title">Contact Us</h2>
        <div className="contact-grid">
          <div className="contact-card">
            <h3>Office Location</h3>
            <p>1335 Route 44 - Suite 1</p>
            <p>Pleasant Valley NY 12569</p>
            <p>
              <strong>Hours:</strong>
            </p>
            <p>Mon - Fri: 9am - 5pm (by Appointment)</p>
            <p>Sat - Sun: Closed</p>
          </div>
          <div className="contact-card">
            <h3>Get In Touch</h3>
            <p>
              <strong>Phone:</strong>
            </p>
            <p>
              <a href="tel:+18455991911">+1 (845) 599-1911</a>
            </p>
            <p>
              <strong>Email:</strong>
            </p>
            <p>
              <a href="mailto:veteranssportsmensassociation@gmail.com">
                veteranssportsmensassociation@gmail.com
              </a>
            </p>
          </div>
          <div className="contact-card">
            <h3>Support Us</h3>
            <p>
              As a Federally Recognized 501c3 Organization, your donations to the VSA are tax
              deductible.
            </p>
            <p>We accept donations, stock donations, and welcome volunteers.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
