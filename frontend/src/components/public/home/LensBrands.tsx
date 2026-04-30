import { lensBrands } from "../../../data/home-content";

export function LensBrands() {
  return (
    <section className="site-container lens-brands-section">
      <div className="section-heading">
        <span>Lentes</span>
        <h2>Lentes que trabalhamos</h2>
        <p>
          Trabalhamos com opções de marcas reconhecidas no mercado óptico.
          Consulte disponibilidade no orçamento.
        </p>
      </div>

      <div className="lens-brand-grid">
        {lensBrands.map((brand) => (
          <article key={brand}>{brand}</article>
        ))}
      </div>
    </section>
  );
}
