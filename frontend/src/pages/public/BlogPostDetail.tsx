import { Link, useParams } from "react-router-dom";
import { getBlogPostBySlug, type BlogPost } from "../../services/blog.service";
import { useEffect, useState } from "react";
import { Seo } from "../../components/seo/Seo";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(new Date(`${value}T00:00:00`));
}

export function BlogPostDetail() {
  const { slug } = useParams();

  const [post, setPost] = useState<BlogPost | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      if (!slug) return;

      try {
        const data = await getBlogPostBySlug(slug);

        setPost(data);
      } catch (error) {
        console.error("Erro ao carregar post:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [slug]);
  if (loading) {
    return (
      <main className="page-shell">
        <section className="page-hero">
          <h1>Carregando artigo...</h1>
        </section>
      </main>
    );
  }

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
      <Seo
        title={`${post.title} | Blog Ótica ShowRoom`}
        description={post.excerpt}
        imageUrl={post.imageUrl ?? undefined}
      />
      <article className="blog-post-detail">
        <div className="site-container blog-post-hero">
          <Link to="/blog" className="blog-post-back-link">
            ← Voltar para o blog
          </Link>

          <span>{post.category}</span>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>

          <div className="blog-post-meta">
            <small>{formatDate(post.publishedAt ?? post.createdAt)}</small>

            <small>{post.readingTime}</small>
          </div>
        </div>

        <div className="site-container blog-post-image-wrapper">
          <img
            src={post.imageUrl ?? "https://placehold.co/1200x700"}
            alt={post.title}
          />
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
