import { Link } from "react-router-dom";
import type { BlogPost } from "../../services/blog.service";

type Props = {
  posts: BlogPost[];
};

export function BlogSidebar({ posts }: Props) {
  return (
    <aside className="blog-sidebar">
      <div className="blog-sidebar-card blog-sidebar-banner">
        <h3>Cuide da sua visão 👓</h3>

        <p>Encontre lentes e armações ideais para seu dia a dia.</p>

        <Link to="/orcamento">Fazer orçamento</Link>
      </div>

      <div className="blog-sidebar-card">
        <h3>Últimos artigos</h3>

        <div className="blog-sidebar-posts">
          {posts.slice(0, 5).map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="blog-sidebar-post"
            >
              <img src={post.imageUrl ?? "https://placehold.co/120x80"} />

              <div>
                <strong>{post.title}</strong>

                <small>{post.category?.name ?? "Blog"}</small>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="blog-sidebar-card">
        <h3>Categorias</h3>

        <ul>
          <li>Lentes</li>
          <li>Armações</li>
          <li>Cuidados</li>
          <li>Saúde visual</li>
        </ul>
      </div>
    </aside>
  );
}
