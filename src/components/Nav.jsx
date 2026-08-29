import { useState } from "react";
import { NavLink } from "react-router-dom";
import ankurLogo from "../assets/ankur-logo.png";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/committee", label: "Executive Committee" },
  { to: "/publications", label: "Publications" },
  { to: "/sponsors", label: "Sponsors" },
  { to: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="site-nav">
      <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
        <img src={ankurLogo} alt="Ankur logo" className="brand-mark-logo" />
        <span className="brand-name">Ankur | অঙ্কুর</span>
      </NavLink>

      <ul className={`nav-menu ${open ? "open" : ""}`}>
        {LINKS.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <button
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "✕" : "☰"}
      </button>
    </nav>
  );
}
