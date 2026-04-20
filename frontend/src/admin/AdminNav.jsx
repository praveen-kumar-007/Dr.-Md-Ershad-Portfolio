import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/publications", label: "Publications" },
  { to: "/admin/achievements", label: "Achievements" },
  { to: "/admin/highlights", label: "Highlights" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/contact", label: "Contact" },
  { to: "/admin/experience", label: "Experience" },
  { to: "/admin/degrees", label: "Academics" },
];

function AdminNav({ onLogout }) {
  return (
    <nav className="admin-nav">
      <div className="admin-brand">Admin Panel</div>
      <div className="admin-links">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
        <button
          type="button"
          className="admin-remove admin-logout-button"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNav;
