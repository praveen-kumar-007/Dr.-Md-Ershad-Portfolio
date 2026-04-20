import { useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import { SkeletonCard } from "../components/SkeletonBlock";
import "../styles/components.css";
import { getHighlights } from "../services/api";

function Highlights() {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHighlights = async () => {
      try {
        const data = await getHighlights();
        setHighlights(data);
      } catch (error) {
        console.error("Failed to load highlights", error);
      } finally {
        setLoading(false);
      }
    };

    loadHighlights();
  }, []);

  return (
    <main className="page-content">
      <SectionHeading title="Research Highlights" eyebrow="Selected work" />
      <section className="panel highlight-panel">
        <p>
          Featured research themes, innovation projects and leadership examples
          are curated through the admin panel.
        </p>
      </section>
      {loading ? (
        <section className="panel">
          <div className="feature-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} lines={3} />
            ))}
          </div>
        </section>
      ) : (
        <div className="feature-grid">
          {highlights.length > 0 ? (
            highlights.map((item) => (
              <article key={item._id} className="feature-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="button-primary"
                  >
                    Learn more
                  </a>
                ) : null}
              </article>
            ))
          ) : (
            <p>No highlight cards are available yet.</p>
          )}
        </div>
      )}
    </main>
  );
}

export default Highlights;
