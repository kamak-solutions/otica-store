type ProductPreviewSectionProps = {
  id?: string;
  kicker: string;
  title: string;
  description?: string;
  filters: string[];
};

export function ProductPreviewSection({
  id,
  kicker,
  title,
  description,
  filters,
}: ProductPreviewSectionProps) {
  return (
    <section className="site-container home-section" id={id}>
      <div className="section-heading">
        <span>{kicker}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>

      <div className="pill-list">
        {filters.map((filter) => (
          <button key={filter} type="button">
            {filter}
          </button>
        ))}
      </div>

      <div className="placeholder-grid">
        <article>Card claro</article>
        <article>Card claro</article>
        <article>Card claro</article>
        <article>Card claro</article>
      </div>
    </section>
  );
}
