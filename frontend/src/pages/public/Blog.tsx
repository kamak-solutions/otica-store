import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { listBlogPosts, type BlogPost } from "../../services/blog.service";
import { Seo } from "../../components/seo/Seo";
import {
  listPublicBanners,
  type StorefrontBanner,
} from "../../services/storefront.service";



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
  const [blogBanner, setBlogBanner] = useState<StorefrontBanner | null>(null);

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
  useEffect(() => {
    async function loadBanner() {
      try {
        const response = await listPublicBanners();

        const banner = response.data.find(
          (item) => item.key === "blog_sidebar",
        );

        setBlogBanner(banner ?? null);
      } catch (error) {
        console.error("Erro ao carregar banner blog", error);
      }
    }

    loadBanner();
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

      <section className="site-container blog-layout">
        <div className="blog-content">
          {loading ? (
            <p>Carregando artigos...</p>
          ) : (
            <>
              {posts[0] && (
                <article className="blog-featured-card">
                  <div className="blog-featured-image">
                    <img
                      src={posts[0].imageUrl ?? "https://placehold.co/1200x700"}
                      alt={posts[0].title}
                    />
                  </div>

                  <div className="blog-featured-content">
                    <span>{posts[0].category?.name ?? "Blog"}</span>

                    <h2>{posts[0].title}</h2>

                    <p>{posts[0].excerpt}</p>

                    <div className="blog-page-card-meta">
                      <small>
                        {formatDate(posts[0].publishedAt ?? posts[0].createdAt)}
                      </small>

                      <small>
                        {posts[0].readingTime
                          ? `${posts[0].readingTime} min`
                          : ""}
                      </small>
                    </div>

                    <Link to={`/blog/${posts[0].slug}`}>Ler artigo</Link>
                  </div>
                </article>
              )}

              <div className="blog-page-grid">
                {posts.slice(1, 7).map((post) => (
                  <article className="blog-page-card" key={post.id}>
                    <div className="blog-page-card-image-wrapper">
                      <img
                        className="blog-page-card-image"
                        src={post.imageUrl ?? "https://placehold.co/800x500"}
                        alt={post.title}
                      />
                    </div>

                    <div className="blog-page-card-content">
                      <span>{post.category?.name ?? "Blog"}</span>

                      <h3>{post.title}</h3>

                      <p>{post.excerpt}</p>

                      <Link to={`/blog/${post.slug}`}>Ler artigo</Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="blog-sidebar">
          <div className="blog-sidebar-card">
            <h3>Últimos artigos</h3>

            {posts.slice(0, 5).map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="blog-sidebar-item"
              >
                {post.title}
              </Link>
            ))}
          </div>

          {blogBanner && (
            <div className="blog-sidebar-card blog-sidebar-ad">
              {blogBanner.imageUrl && (
                <img src={blogBanner.imageUrl} alt="Banner blog" />
              )}

              <h3>{blogBanner.title}</h3>

              <p>{blogBanner.description}</p>

              <Link
                to={blogBanner.buttonHref ?? "/orcamento"}
                className="button-primary"
              >
                Saiba mais
              </Link>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
