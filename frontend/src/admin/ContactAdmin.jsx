import { useEffect, useState } from "react";
import { createContact, getContact, updateContact } from "../services/api";

function ContactAdmin() {
  const [details, setDetails] = useState({
    name: "",
    role: "",
    heroTagline: "",
    heroSubtitle: "",
    heroLead: "",
    phone: "",
    email: "",
    address: "",
    scholarUrl: "",
    profileImageUrl: "",
    googleScholar: "",
    googleScholarDetail: "",
    scopus: "",
    scopusDetail: "",
    academicExperience: "",
    academicExperienceDetail: "",
    researchFocus: "",
    researchFocusDetail: "",
  });
  const [contactId, setContactId] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContact = async () => {
      try {
        const data = await getContact();
        setContactId(data._id);
        setDetails({
          name: data.name || "",
          role: data.role || "",
          heroTagline: data.heroTagline || "",
          heroSubtitle: data.heroSubtitle || "",
          heroLead: data.heroLead || "",
          phone: data.phone,
          email: data.email,
          address: data.address,
          scholarUrl: data.scholarUrl,
          profileImageUrl: data.profileImageUrl || "",
          googleScholar: data.googleScholar || "",
          googleScholarDetail: data.googleScholarDetail || "",
          scopus: data.scopus || "",
          scopusDetail: data.scopusDetail || "",
          academicExperience: data.academicExperience || "",
          academicExperienceDetail: data.academicExperienceDetail || "",
          researchFocus: data.researchFocus || "",
          researchFocusDetail: data.researchFocusDetail || "",
        });
      } catch (error) {
        console.warn("Unable to load contact", error);
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, []);

  const handleChange = (field) => (event) => {
    setDetails({ ...details, [field]: event.target.value });
  };

  const handleProfileImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProfileImageFile(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = () =>
        setDetails({ ...details, profileImageUrl: reader.result });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const saveContact = async () => {
    const payload = { ...details };

    if (!details.email?.trim() || !details.phone?.trim()) {
      alert(
        "Please provide both email and phone before saving contact details.",
      );
      return;
    }

    if (
      profileImageFile &&
      details.profileImageUrl &&
      details.profileImageUrl.startsWith("data:")
    ) {
      payload.profileImageUrl = details.profileImageUrl;
    }

    try {
      if (contactId) {
        await updateContact(contactId, payload);
      } else {
        const created = await createContact(payload);
        setContactId(created._id);
      }
      alert("Contact details saved successfully");
    } catch (error) {
      alert(`Failed to save contact details: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1>Manage Contact</h1>
        <p>
          Update contact details and scholar profile information for the
          academic portfolio.
        </p>
      </div>

      <div className="admin-form-panel">
        <div className="form-group">
          <label>Name</label>
          <input
            value={details.name}
            onChange={handleChange("name")}
            placeholder="Dr. Md Ershad"
          />
        </div>
        <div className="form-group">
          <label>Current role</label>
          <input
            value={details.role}
            onChange={handleChange("role")}
            placeholder="Assistant Professor"
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            value={details.address}
            onChange={handleChange("address")}
            placeholder="Kolkata, India"
          />
        </div>
        <div className="form-group">
          <label>Hero tagline</label>
          <input
            value={details.heroTagline}
            onChange={handleChange("heroTagline")}
            placeholder="Academic portfolio"
          />
        </div>
        <div className="form-group">
          <label>Hero subtitle</label>
          <input
            value={details.heroSubtitle}
            onChange={handleChange("heroSubtitle")}
            placeholder="Assistant Professor..."
          />
        </div>
        <div className="form-group">
          <label>Hero lead text</label>
          <textarea
            value={details.heroLead}
            onChange={handleChange("heroLead")}
            placeholder="An educator and researcher..."
          />
        </div>
        <div className="form-group">
          <label>Scholar profile</label>
          <input
            value={details.scholarUrl}
            onChange={handleChange("scholarUrl")}
            placeholder="Scholar link"
          />
        </div>
        <div className="admin-section-subheader">
          <h2>Citation metrics</h2>
          <p>
            Enter the citation count and index details that appear on the
            homepage.
          </p>
        </div>
        <div className="form-group">
          <label>Google Scholar citations</label>
          <input
            value={details.googleScholar}
            onChange={handleChange("googleScholar")}
            placeholder="349 citations"
          />
        </div>
        <div className="form-group">
          <label>Google Scholar detail</label>
          <input
            value={details.googleScholarDetail}
            onChange={handleChange("googleScholarDetail")}
            placeholder="h-index 11, i10-index 12"
          />
        </div>
        <div className="form-group">
          <label>Scopus citations</label>
          <input
            value={details.scopus}
            onChange={handleChange("scopus")}
            placeholder="232 citations"
          />
        </div>
        <div className="form-group">
          <label>Scopus detail</label>
          <input
            value={details.scopusDetail}
            onChange={handleChange("scopusDetail")}
            placeholder="h-index 8"
          />
        </div>
        <div className="form-group">
          <label>Academic experience</label>
          <input
            value={details.academicExperience}
            onChange={handleChange("academicExperience")}
            placeholder="5+ years"
          />
        </div>
        <div className="form-group">
          <label>Academic experience detail</label>
          <input
            value={details.academicExperienceDetail}
            onChange={handleChange("academicExperienceDetail")}
            placeholder="Higher education and research"
          />
        </div>
        <div className="form-group">
          <label>Research focus</label>
          <input
            value={details.researchFocus}
            onChange={handleChange("researchFocus")}
            placeholder="Materials & Manufacturing"
          />
        </div>
        <div className="form-group">
          <label>Research focus detail</label>
          <input
            value={details.researchFocusDetail}
            onChange={handleChange("researchFocusDetail")}
            placeholder="3D printing, bioactive materials, IC engines"
          />
        </div>
        <div className="form-group">
          <label>Profile photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
          {details.profileImageUrl ? (
            <img
              src={details.profileImageUrl}
              alt="Profile preview"
              className="admin-gallery-preview"
            />
          ) : null}
        </div>
      </div>

      <button
        type="button"
        className="admin-button"
        onClick={saveContact}
        disabled={loading}
      >
        {loading ? "Loading..." : "Save Contact"}
      </button>
    </div>
  );
}

export default ContactAdmin;
