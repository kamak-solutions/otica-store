import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { listBlogPosts, type BlogPost } from "../../services/blog.service";
import { Seo } from "../../components/seo/Seo";

function formatDate(value?: string | null) {
  if (!value) {
    return "Sem data";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(new Date(value));
}

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await listBlogPosts();

        setPosts(data);
      } catch (error) {
        console.error("Erro ao carregar posts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

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
        {loading ? (
          <p>Carregando artigos...</p>
        ) : (
          posts.map((post) => (
            <article className="blog-page-card" key={post.id}>
              <div className="blog-page-card-image-wrapper">
                <img
                  className="blog-page-card-image"
                  src={post.imageUrl ?? "https://placehold.co/1200x700"}
                  alt={post.title}
                />
              </div>

              <div className="blog-page-card-content">
                <span>{post.category}</span>

                <h2>{post.title}</h2>

                <p>{post.excerpt}</p>

                <div className="blog-page-card-meta">
                  <small>
                    {formatDate(post.publishedAt ?? post.createdAt)}
                  </small>

                  <small>{post.readingTime}</small>
                </div>

                <Link to={`/blog/${post.slug}`}>Ler artigo</Link>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
