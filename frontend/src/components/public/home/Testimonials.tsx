import { testimonials } from "../../../data/home-content";

export function Testimonials() {
  return (
    <section className="site-container testimonials-section">
      <div className="section-heading">
        <span>Depoimentos</span>
        <h2>O que nossos clientes dizem</h2>
        <p>
          Atendimento, orientação e cuidado na escolha dos óculos fazem
          diferença.
        </p>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <article className="testimonial-card" key={testimonial.name}>
            <div className="testimonial-header">
              <div className="testimonial-avatar">{testimonial.initials}</div>

              <div>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.label}</span>
              </div>
            </div>

            <p>“{testimonial.text}”</p>

            <div className="testimonial-stars" aria-label="Avaliação 5 estrelas">
              ★★★★★
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
