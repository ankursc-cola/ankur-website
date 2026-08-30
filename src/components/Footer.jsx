import ankurLogo from "../assets/ankur-logo.png";
import ankurLogoLite from "../assets/ankur-logo-lite.png";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <h5>Ankur | অঙ্কুর </h5>
        <p>Bengali Association of South Carolina — a community keeping Bengal's festivals, food,
        language, and warmth alive in the Midlands.</p>
        <img src={ankurLogo} alt="Ankur logo" className="brand-footer-logo" />
      </div>
      <div>
        <h5>Quick Links</h5>
        <p><a href="/contact">Become a Member</a></p>
        <p><a href="/events">Events Calendar</a></p>
        <p><a href="/gallery">Photo Gallery</a></p>
        <p><a href="/committee">Executive Committee</a></p>
        <p><a href="/sponsors">Become a Sponsor</a></p>
        
        
      </div>
      <div>
        <h5>Get in Touch</h5>
        <p>ankursc.12@gmail.com</p>
        <p>Columbia, South Carolina</p>
        <p><a href="/contact">Contact Us →</a></p>
      </div>
      <div className="footer-bottom" style={{ gridColumn: "1 / -1" }}>
        © {new Date().getFullYear()} Ankur — Bengali Association of South Carolina. All rights reserved.
      </div>
    </footer>
  );
}
