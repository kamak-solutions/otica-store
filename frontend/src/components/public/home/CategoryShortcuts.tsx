import { categoryShortcuts } from "../../../data/home-content";

export function CategoryShortcuts() {
  return (
    <section className="site-container category-shortcuts">
      {categoryShortcuts.map((category) => (
        <button key={category.label} type="button">
          <span>{category.initials}</span>
          <strong>{category.label}</strong>
        </button>
      ))}
    </section>
  );
}
