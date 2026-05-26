import { Link } from "react-router-dom";
import { categoryShortcuts } from "../../../data/home-content";

export function CategoryShortcuts() {
  return (
    <section className="site-container home-section">
      <div className="category-shortcuts-grid">
        {categoryShortcuts.map((item) => (
          <Link
            key={item.label}
            to={item.link}
            className="category-shortcut-card"
          >
            <img
              src={item.image}
              alt={item.label}
              className="category-shortcut-image"
            />

            <div className="category-shortcut-overlay">
              <h3>{item.label}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}