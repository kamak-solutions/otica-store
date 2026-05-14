import { Link } from "react-router-dom";
import { blogPosts } from "../../data/blog-posts";
import { Seo } from "../../components/seo/Seo";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(new Date(`${value}T00:00:00`));
}

export function Blog() {
  return (
    <main className="page-shell">
      <Seo
        title="Blog | Ótica ShowRoom"
        description="Dicas sobre armações, lentes, cuidados com óculos, saúde visual e escolha do modelo ideal."
      />
      <section className="page-hero">
        <span>Blog</span>
        <h1>Dicas da Ótica ShowRoom</h1>
        <p>
          Conteúdos sobre armações, lentes, cuidados com os óculos, saúde visual
          e escolha do modelo ideal.
        </p>
      </section>

      <section className="site-container blog-page-grid">
        {blogPosts.map((post) => (
          <article className="blog-page-card" key={post.slug}>
            <div className="blog-page-card-image-wrapper">
              <img
                className="blog-page-card-image"
                src={post.imageUrl}
                alt={post.title}
              />
            </div>

            <div className="blog-page-card-content">
              <span>{post.category}</span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>

              <div className="blog-page-card-meta">
                <small>{formatDate(post.publishedAt)}</small>
                <small>{post.readingTime}</small>
              </div>

              <Link to={`/blog/${post.slug}`}>Ler artigo</Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
