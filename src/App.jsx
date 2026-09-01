import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Events from "./pages/Events.jsx";
import Gallery from "./pages/Gallery.jsx";
import GalleryEvent from "./pages/GalleryEvent.jsx";
import ExecutiveCommittee from "./pages/ExecutiveCommittee.jsx";
import Publications from "./pages/Publications.jsx";
import Sponsors from "./pages/Sponsors.jsx";
import Contact from "./pages/Contact.jsx";

function Layout({ children }) {
  return (
    <div className="page-shell">
      <Nav />
      {children}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
        <Route path="/gallery/:eventSlug" element={<Layout><GalleryEvent /></Layout>} />
        <Route path="/committee" element={<Layout><ExecutiveCommittee /></Layout>} />
        <Route path="/publications" element={<Layout><Publications /></Layout>} />
        <Route path="/sponsors" element={<Layout><Sponsors /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}