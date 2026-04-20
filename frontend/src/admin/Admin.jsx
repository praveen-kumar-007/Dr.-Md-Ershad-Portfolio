import { Link } from "react-router-dom";

const features = [
  {
    label: "Publications",
    description:
      "Add, update, or remove research outputs and patent records with a single interface.",
    path: "/admin/publications",
  },
  {
    label: "Achievements",
    description:
      "Manage awards, recognition and academic honours for the homepage.",
    path: "/admin/achievements",
  },
  {
    label: "Gallery",
    description:
      "Manage gallery cards for events, classrooms, and research showcases.",
    path: "/admin/gallery",
  },
  {
    label: "Contact",
    description:
      "Update contact details and scholar profile information for the academic portfolio.",
    path: "/admin/contact",
  },
  {
    label: "Experience",
    description:
      "Manage teaching roles, institutional affiliations, and school or college logo uploads.",
    path: "/admin/experience",
  },
  {
    label: "Academics",
    description:
      "Manage degrees, certifications and academic qualifications with logo support.",
    path: "/admin/degrees",
  },
];

function Admin() {
  return (
    <div className="admin-dashboard">
      <div className="admin-hero">
        <h1>Admin Dashboard</h1>
        <p>
          Use these controls to manage site content, keep publication details
          updated, and refresh gallery highlights.
        </p>
      </div>

      <div className="admin-card-grid">
        {features.map((feature) => (
          <Link key={feature.label} to={feature.path} className="admin-card">
            <h2>{feature.label}</h2>
            <p>{feature.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Admin;
