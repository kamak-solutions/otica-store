import { Link, useParams } from "react-router-dom";
import { findBlogPostBySlug } from "../../data/blog-posts";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(new Date(`${value}T00:00:00`));
}

export function BlogPostDetail() {
  const { slug } = useParams();

  const post = slug ? findBlogPostBySlug(slug) : null;

  if (!post) {
    return (
      <main className="page-shell">
        <section className="page-hero">
          <span>Blog</span>
          <h1>Artigo não encontrado</h1>
          <p>O conteúdo solicitado não está disponível.</p>

          <Link className="button-primary" to="/blog">
            Voltar para o blog
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <article className="blog-post-detail">
        <div className="site-container blog-post-hero">
          <Link to="/blog" className="blog-post-back-link">
            ← Voltar para o blog
          </Link>

          <span>{post.category}</span>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>

          <div className="blog-post-meta">
            <small>{formatDate(post.publishedAt)}</small>
            <small>{post.readingTime}</small>
          </div>
        </div>

        <div className="site-container blog-post-image-wrapper">
          <img src={post.imageUrl} alt={post.title} />
        </div>

        <div className="site-container blog-post-content">
          {post.content.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>

              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          <div className="blog-post-cta">
            <strong>Precisa de ajuda para escolher seus óculos?</strong>
            <p>
              Envie sua receita ou solicite um orçamento personalizado com a
              Ótica ShowRoom.
            </p>

            <div>
              <Link className="button-primary" to="/orcamento">
                Solicitar orçamento
              </Link>

              <Link className="button-secondary" to="/">
                Ver produtos
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
