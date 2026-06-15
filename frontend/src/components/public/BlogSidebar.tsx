import { Link } from "react-router-dom";

import type { BlogPost } from "../../services/blog.service";

import type { Widget } from "../../services/widget.service";

import { BlogSidebarBanner } from "./BlogSidebarBanner";

type Props = {
  posts: BlogPost[];
  widgets: Widget[];
};

export function BlogSidebar({ posts, widgets }: Props) {
  return (
    <aside className="blog-sidebar">
      <div className="blog-sidebar-card">
        <h3>Últimos artigos</h3>

        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="blog-sidebar-post"
          >
            <img src={post.imageUrl ?? "https://placehold.co/120x80"} />

            <strong>{post.title}</strong>
          </Link>
        ))}
      </div>

      {widgets.map((widget) => (
        <BlogSidebarBanner
          key={widget.id}
          type={widget.type}
          title={widget.title ?? ""}
          description={widget.description}
          mediaUrl={widget.mediaUrl}
          embedCode={widget.embedCode}
          redirectUrl={widget.redirectUrl}
          buttonLabel={widget.buttonLabel}
          aspectRatio={widget.aspectRatio}
        />
      ))}

      <div className="blog-sidebar-card">
        <h3>Precisa de ajuda?</h3>

        <p>Envie sua receita e receba orçamento.</p>

        <Link to="/orcamento" className="button-primary">
          Solicitar orçamento
        </Link>
      </div>
    </aside>
  );
}
