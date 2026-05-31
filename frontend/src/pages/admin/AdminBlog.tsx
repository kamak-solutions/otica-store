import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import type { BlogPost } from "../../services/blog.service";

import { listBlogPosts, deleteBlogPost } from "../../services/blog.service";

function formatDate(value?: string | null) {
  if (!value) {
    return "Não publicado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(value));
}

export function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const [loading, setLoading] = useState(true);

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

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Deseja excluir este artigo?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteBlogPost(id);

      setPosts((current) => current.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);

      alert("Erro ao excluir artigo.");
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>

          <h1>Blog</h1>

          <p>Gerencie artigos do blog.</p>
        </div>

        <Link to="/admin/blog/novo">
          <button type="button">Novo artigo</button>
        </Link>
      </div>

      <div className="admin-table-card">
        {loading ? (
          <p>Carregando artigos...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagem</th>

                <th>Título</th>

                <th>Categoria</th>

                <th>Publicado</th>

                <th>Status</th>

                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        style={{
                          width: "80px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>{post.title}</td>
                  <td>{post.category?.name ?? "-"}</td>

                  <td>{formatDate(post.publishedAt)}</td>

                  <td>{post.published ? "🟢 Publicado" : "🟡 Rascunho"}</td>

                  <td>
                    <div className="campaign-actions">
                      <Link to={`/admin/blog/${post.id}/editar`}>
                        <button type="button">Editar</button>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
