import { blogPosts } from "../../../data/home-content";

export function BlogPreview() {
  return (
    <section className="site-container home-section">
      <div className="section-heading">
        <span>Blog</span>
        <h2>Dicas para cuidar da sua visão</h2>
        <p>
          Conteúdos para ajudar você a escolher armações, entender lentes e
          cuidar melhor dos seus óculos.
        </p>
      </div>

      <div className="home-blog-grid">
        {blogPosts.map((post) => (
          <article className="blog-card" key={post.title}>
            <div className="blog-card-image-wrapper">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="blog-card-image"
              />
            </div>

            <div className="blog-card-content">
              <span>{post.category}</span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <a href="/blog" className="blog-card-link">
                Ler artigo
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
