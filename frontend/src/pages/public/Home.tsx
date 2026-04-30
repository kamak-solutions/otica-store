import { useEffect, useState } from "react";

type HeroSlide = {
  kicker: string;
  title: string;
  description: string;
  imageUrl: string;
  primaryAction: string;
  secondaryAction: string;
};

const heroSlides: HeroSlide[] = [
  {
    kicker: "Nova coleção",
    title: "Armações modernas para renovar seu visual",
    description:
      "Escolha modelos confortáveis, elegantes e selecionados para combinar com seu estilo.",
    imageUrl:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=2200&q=90&sat=20",
    primaryAction: "Ver armações",
    secondaryAction: "Enviar receita",
  },
  {
    kicker: "Óculos solar",
    title: "Proteção e estilo para o seu dia a dia",
    description:
      "Modelos solares para rotina, lazer e combinações com personalidade.",
    imageUrl:
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=2200&q=90&sat=25",
    primaryAction: "Ver solares",
    secondaryAction: "Ver catálogo",
  },
  {
    kicker: "Lentes de grau",
    title: "Envie sua receita e solicite um orçamento",
    description:
      "Receba orientação para lentes, armações e soluções visuais para sua rotina.",
    imageUrl:
      "https://images.unsplash.com/photo-1556306535-38febf6782e7?auto=format&fit=crop&w=2200&q=90&sat=20",
    primaryAction: "Solicitar orçamento",
    secondaryAction: "Conhecer lentes",
  },
];

export function Home() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlideIndex((currentIndex) =>
        currentIndex === heroSlides.length - 1 ? 0 : currentIndex + 1,
      );
    }, 5500);

    return () => window.clearInterval(interval);
  }, []);

  const activeSlide = heroSlides[activeSlideIndex];

  return (
    <main className="home-page">
      <section className="hero-slider">
        <img
          className="hero-slider-image"
          src={activeSlide.imageUrl}
          alt={activeSlide.title}
        />

        <div className="hero-slider-overlay" />

        <div className="site-container hero-slider-inner">
          <div className="hero-slider-content">
            <span>{activeSlide.kicker}</span>

            <h1>{activeSlide.title}</h1>

            <p>{activeSlide.description}</p>

            <div className="hero-actions">
              <a className="button-primary" href="#modelos">
                {activeSlide.primaryAction}
              </a>

              <a className="button-secondary" href="#receita">
                {activeSlide.secondaryAction}
              </a>
            </div>
          </div>
        </div>

        <div className="site-container hero-dots-container">
          <div className="hero-dots">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                className={index === activeSlideIndex ? "active" : ""}
                type="button"
                aria-label={`Ir para banner ${index + 1}`}
                onClick={() => setActiveSlideIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="site-container category-shortcuts">
        <button type="button">
          <span>OS</span>
          <strong>Óculos Solar</strong>
        </button>

        <button type="button">
          <span>OG</span>
          <strong>Óculos de Grau</strong>
        </button>

        <button type="button">
          <span>AR</span>
          <strong>Armações</strong>
        </button>

        <button type="button">
          <span>LE</span>
          <strong>Lentes</strong>
        </button>

        <button type="button">
          <span>AC</span>
          <strong>Acessórios</strong>
        </button>
      </section>

      <section className="site-container home-banner">
        <div>
          <span>Vitrine da semana</span>
          <h2>Armações, solares e lentes com atendimento personalizado</h2>
          <p>
            Escolha seu produto, envie sua receita se precisar e receba uma
            orientação mais segura para comprar melhor.
          </p>
        </div>

        <a className="button-primary" href="#modelos">
          Ver produtos
        </a>
      </section>

      <section className="site-container home-section" id="modelos">
        <div className="section-heading">
          <span>Escolha por estilo</span>
          <h2>Encontre seu modelo ideal</h2>
          <p>Depois vamos ligar essa seção aos produtos reais do backend.</p>
        </div>

        <div className="pill-list">
          <button>Todos</button>
          <button>Feminino</button>
          <button>Masculino</button>
          <button>Infantil</button>
          <button>Unissex</button>
        </div>

        <div className="placeholder-grid">
          <article>Card claro</article>
          <article>Card claro</article>
          <article>Card claro</article>
          <article>Card claro</article>
        </div>
      </section>
      <section className="site-container campaign-banner">
        <div>
          <span>Campanha do mês</span>
          <h2>Varilux em dobro</h2>
          <p>
            Consulte condições especiais para lentes Varilux e monte seu
            orçamento com atendimento personalizado.
          </p>
        </div>

        <a className="button-primary" href="#receita">
          Quero orçamento
        </a>
      </section>

      <section className="site-container home-section" id="categorias">
        <div className="section-heading">
          <span>Compre por categoria</span>
          <h2>Explore nossas categorias</h2>
        </div>

        <div className="pill-list">
          <button>Óculos Solar</button>
          <button>Óculos de Grau</button>
          <button>Armações</button>
          <button>Lentes</button>
          <button>Acessórios</button>
        </div>

        <div className="placeholder-grid">
          <article>Card claro</article>
          <article>Card claro</article>
          <article>Card claro</article>
          <article>Card claro</article>
        </div>
      </section>
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
          <article>Varilux</article>
          <article>Essilor</article>
          <article>Crizal</article>
          <article>Transitions</article>
          <article>Hoya</article>
          <article>Zeiss</article>
          <article>Rodenstock</article>
          <article>Kodak Lens</article>
        </div>
      </section>

      <section className="site-container home-section">
        <div className="section-heading">
          <span>Blog</span>
          <h2>Dicas para cuidar da sua visão e escolher melhor</h2>
          <p>
            Conteúdos rápidos para ajudar na escolha de armações, lentes e
            cuidados.
          </p>
        </div>

        <div className="home-blog-grid">
          <article className="blog-card">
            <div className="blog-card-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80"
                alt="Como escolher a armação ideal para seu rosto"
                className="blog-card-image"
              />
            </div>

            <div className="blog-card-content">
              <span>Armações</span>
              <h3>Como escolher a armação ideal para seu rosto</h3>
              <p>
                Entenda como formato, proporção e estilo ajudam na escolha da
                armação.
              </p>
              <a href="/blog" className="blog-card-link">
                Ler artigo
              </a>
            </div>
          </article>

          <article className="blog-card">
            <div className="blog-card-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=80"
                alt="Antirreflexo, blue cut e fotossensível"
                className="blog-card-image"
              />
            </div>

            <div className="blog-card-content">
              <span>Lentes</span>
              <h3>Antirreflexo, blue cut e fotossensível: qual escolher?</h3>
              <p>
                Veja diferenças entre tipos de lentes e quando cada opção pode
                ajudar.
              </p>
              <a href="/blog" className="blog-card-link">
                Ler artigo
              </a>
            </div>
          </article>

          <article className="blog-card">
            <div className="blog-card-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80"
                alt="Quando trocar seus óculos de grau"
                className="blog-card-image"
              />
            </div>

            <div className="blog-card-content">
              <span>Cuidados</span>
              <h3>Quando trocar seus óculos de grau?</h3>
              <p>
                Sinais de que está na hora de revisar sua receita ou renovar
                suas lentes.
              </p>
              <a href="/blog" className="blog-card-link">
                Ler artigo
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="site-container quote-banner" id="receita">
        <div>
          <span>Receita e lentes</span>
          <h2>Tem receita? Envie para fazermos seu orçamento</h2>
          <p>
            Ideal para lentes de grau, multifocais, antirreflexo, blue cut ou
            opções específicas para sua rotina.
          </p>
        </div>

        <button className="button-primary" type="button">
          Solicitar orçamento
        </button>
      </section>
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
          <article className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">AP</div>

              <div>
                <strong>Ana Paula</strong>
                <span>Cliente Ótica ShowRoom</span>
              </div>
            </div>

            <p>
              “Atendimento excelente. Me ajudaram a escolher a armação e
              explicaram as opções de lentes com muita atenção.”
            </p>

            <div
              className="testimonial-stars"
              aria-label="Avaliação 5 estrelas"
            >
              ★★★★★
            </div>
          </article>

          <article className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">CM</div>

              <div>
                <strong>Carlos Mendes</strong>
                <span>Orçamento com receita</span>
              </div>
            </div>

            <p>
              “Enviei minha receita e recebi um orçamento claro. Foi muito mais
              fácil decidir qual lente escolher.”
            </p>

            <div
              className="testimonial-stars"
              aria-label="Avaliação 5 estrelas"
            >
              ★★★★★
            </div>
          </article>

          <article className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">RS</div>

              <div>
                <strong>Renata Souza</strong>
                <span>Cliente Ótica ShowRoom</span>
              </div>
            </div>

            <p>
              “Gostei muito das opções de armações e do cuidado no atendimento.
              A orientação fez diferença na escolha.”
            </p>

            <div
              className="testimonial-stars"
              aria-label="Avaliação 5 estrelas"
            >
              ★★★★★
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
