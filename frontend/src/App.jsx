import { useEffect, useState } from "react";
import { BrowserRouter, NavLink, Routes, Route } from "react-router-dom";
import { getContact } from "./services/api";
import Home from "./pages/Home";
import Experience from "./pages/Experience";
import Publications from "./pages/Publications";
import Highlights from "./pages/Highlights";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Achievements from "./pages/Achievements";
import AdminLayout from "./admin/AdminLayout";
import Admin from "./admin/Admin";
import PublicationsAdmin from "./admin/PublicationsAdmin";
import GalleryAdmin from "./admin/GalleryAdmin";
import ContactAdmin from "./admin/ContactAdmin";
import ExperienceAdmin from "./admin/ExperienceAdmin";
import DegreeAdmin from "./admin/DegreeAdmin";
import AchievementsAdmin from "./admin/AchievementsAdmin";
import HighlightsAdmin from "./admin/HighlightsAdmin";
import "./styles/pages.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const loadContact = async () => {
      try {
        const data = await getContact();
        setLogoUrl(data.profileImageUrl || "");
      } catch (error) {
        console.warn("Unable to load contact image for navbar", error);
      }
    };

    loadContact();
  }, []);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="portfolio-header">
          <div className="portfolio-brand">
            <div className="brand">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Dr. Md Ershad"
                  className="brand-image"
                />
              ) : (
                <span className="brand-mark">DE</span>
              )}
              <span className="brand-text">Dr. Md Ershad</span>
            </div>
            <button
              type="button"
              className={`nav-toggle ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              <span />
              <span />
              <span />
            </button>
          </div>

          <nav className="nav-links">
            <div className="nav-profile-panel">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Dr. Md Ershad"
                  className="nav-profile-avatar"
                />
              ) : (
                <div className="nav-profile-avatar nav-profile-fallback">
                  DE
                </div>
              )}
              <div>
                <div className="nav-profile-name">Dr. Md Ershad</div>
                <div className="nav-profile-role">Assistant Professor</div>
              </div>
            </div>

            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={handleLinkClick}
            >
              Home
            </NavLink>
            <NavLink
              to="/experience"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={handleLinkClick}
            >
              Experience
            </NavLink>
            <NavLink
              to="/publications"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={handleLinkClick}
            >
              Publications
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={handleLinkClick}
            >
              Gallery
            </NavLink>
            <NavLink
              to="/achievements"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={handleLinkClick}
            >
              Achievements
            </NavLink>
            <NavLink
              to="/highlights"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={handleLinkClick}
            >
              Highlights
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={handleLinkClick}
            >
              Contact
            </NavLink>
          </nav>
        </header>

        <div className={`mobile-nav ${menuOpen ? "open" : ""}`}>
          <div className="mobile-nav-top">
            <div className="mobile-nav-brand">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Dr. Md Ershad"
                  className="nav-profile-avatar"
                />
              ) : (
                <div className="nav-profile-avatar nav-profile-fallback">
                  DE
                </div>
              )}
              <div className="mobile-nav-title">
                <div className="nav-profile-name">Dr. Md Ershad</div>
                <div className="nav-profile-role">Assistant Professor</div>
              </div>
            </div>
            <button
              type="button"
              className="mobile-nav-close"
              onClick={handleLinkClick}
              aria-label="Close navigation"
            >
              <span />
            </button>
          </div>

          <div className="mobile-nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "mobile-nav-link mobile-nav-home active"
                  : "mobile-nav-link mobile-nav-home"
              }
              onClick={handleLinkClick}
            >
              Home
            </NavLink>
            <NavLink
              to="/experience"
              className={({ isActive }) =>
                isActive
                  ? "mobile-nav-link mobile-nav-experience active"
                  : "mobile-nav-link mobile-nav-experience"
              }
              onClick={handleLinkClick}
            >
              Experience
            </NavLink>
            <NavLink
              to="/publications"
              className={({ isActive }) =>
                isActive
                  ? "mobile-nav-link mobile-nav-publications active"
                  : "mobile-nav-link mobile-nav-publications"
              }
              onClick={handleLinkClick}
            >
              Publications
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                isActive
                  ? "mobile-nav-link mobile-nav-gallery active"
                  : "mobile-nav-link mobile-nav-gallery"
              }
              onClick={handleLinkClick}
            >
              Gallery
            </NavLink>
            <NavLink
              to="/achievements"
              className={({ isActive }) =>
                isActive
                  ? "mobile-nav-link mobile-nav-achievements active"
                  : "mobile-nav-link mobile-nav-achievements"
              }
              onClick={handleLinkClick}
            >
              Achievements
            </NavLink>
            <NavLink
              to="/highlights"
              className={({ isActive }) =>
                isActive
                  ? "mobile-nav-link mobile-nav-highlights active"
                  : "mobile-nav-link mobile-nav-highlights"
              }
              onClick={handleLinkClick}
            >
              Highlights
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "mobile-nav-link mobile-nav-contact active"
                  : "mobile-nav-link mobile-nav-contact"
              }
              onClick={handleLinkClick}
            >
              Contact
            </NavLink>
          </div>

          <div className="mobile-nav-footer">
            <div className="mobile-nav-footer-logo">
              {logoUrl ? (
                <img src={logoUrl} alt="Dr. Md Ershad" />
              ) : (
                <span>DE</span>
              )}
            </div>
            <div className="mobile-nav-footer-copy">
              <span>Dr. Md Ershad — Academic Leader & Research Scholar</span>
            </div>
          </div>
        </div>

        <div
          className={`nav-backdrop ${menuOpen ? "open" : ""}`}
          onClick={handleLinkClick}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/highlights" element={<Highlights />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Admin />} />
            <Route path="publications" element={<PublicationsAdmin />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="contact" element={<ContactAdmin />} />
            <Route path="experience" element={<ExperienceAdmin />} />
            <Route path="degrees" element={<DegreeAdmin />} />
            <Route path="achievements" element={<AchievementsAdmin />} />
            <Route path="highlights" element={<HighlightsAdmin />} />
          </Route>
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
