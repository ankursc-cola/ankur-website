import { useState } from "react";
import GlowLayer from "../components/GlowLayer.jsx";
import RisingEmbers from "../components/RisingEmbers.jsx";

// formspree unique form id 
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvkpeqez";

export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
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
        {status === "success" ? (
          <p className="contact-success">
            Thank you — your message has been sent. Someone from Ankur will get back to you soon.
          </p>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Your name" required />
            <input type="email" name="email" placeholder="Your email" required />
            <textarea name="message" placeholder="Your message : Become a member | Join our community" required />
            <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>
            {status === "error" && (
              <p className="contact-error">
                Something went wrong sending your message — please try again, or email us directly.
              </p>
            )}
          </form>
        )}
      </section>
    </>
  );
}