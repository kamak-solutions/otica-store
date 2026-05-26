import { lensBrands } from "../../../data/home-content";

export function LensBrands() {
  return (
    <section className="site-container home-section">
      <div className="section-heading">
        <span>Marcas</span>
        <h2>Trabalhamos com grandes fabricantes</h2>
        <p>
          Lentes e tecnologias das principais marcas do mercado.
        </p>
      </div>

      <div className="brands-marquee">
        <div className="brands-track">
          {[...lensBrands, ...lensBrands].map((brand, index) => (
            <article
              key={`${brand.name}-${index}`}
              className="brand-card"
            >
              <img
                src={brand.logo}
                alt={brand.name}
              />

              <span>{brand.name}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}