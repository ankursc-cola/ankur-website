import GlowLayer from "../components/GlowLayer.jsx";
import RisingEmbers from "../components/RisingEmbers.jsx";

export default function Contact() {
  function handleSubmit(e) {
    e.preventDefault();
    alert("This form is a UI placeholder — wire it up to email/Formspree/etc. before launch.");
  }

  return (
    <>
      <header className="page-header">
        <GlowLayer />
        <RisingEmbers count={35} />
        <span className="kicker">Reach Out</span>
        <h1>Contact Us</h1>
        <h1 className="headline font-bangla">যোগাযোগ</h1>
        <p>Questions about an event, sponsorship, or joining the committee — we'd love to hear from you.</p>
      </header>

      <section className="section">
        <form className="contact-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Your name" required />
          <input type="email" placeholder="Your email" required />
          <textarea placeholder="Your message" required />
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      </section>
    </>
  );
}
