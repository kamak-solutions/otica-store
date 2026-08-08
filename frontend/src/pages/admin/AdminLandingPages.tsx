import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  landingPagesService,
  type LandingPage,
} from "../../services/landing-pages.service";

export function AdminLandingPages() {
  const navigate = useNavigate();
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchLandingPages() {
      try {
        const response = await landingPagesService.list();

        if (isMounted) {
          // Garante que o estado receba um array válido, mesmo que a API envie um objeto envelopado ({ data: [...] })
          if (Array.isArray(response)) {
            setLandingPages(response);
          } else if (
            response &&
            typeof response === "object" &&
            "data" in response &&
            Array.isArray((response as { data: LandingPage[] }).data)
          ) {
            setLandingPages((response as { data: LandingPage[] }).data);
          } else {
            setLandingPages([]);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar landing pages:", error);
        if (isMounted) setLandingPages([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchLandingPages();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir a landing page "${title}"?`)) {
      return;
    }

    try {
      await landingPagesService.delete(id);
      setLandingPages((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erro ao deletar landing page:", error);
      alert("Não foi possível excluir a landing page.");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Landing Pages</h1>
          <p className="admin-subtitle">
            Gerencie as páginas de captura do seu catálogo
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/landing-pages/nova")}
          className="btn-primary"
        >
          + Nova Landing Page
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "48px", color: "#666" }}>
          Carregando landing pages...
        </div>
      ) : landingPages.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "1px dashed #ccc",
          }}
        >
          <p style={{ color: "#666" }}>
            Nenhuma landing page cadastrada ainda.
          </p>
        </div>
      ) : (
        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>URL (Slug)</th>
                <th>Status</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {landingPages.map((lp) => (
                <tr key={lp.id}>
                  <td style={{ fontWeight: 600, color: "#111827" }}>
                    {lp.title}
                  </td>
                  <td className="font-mono">/l/{lp.slug}</td>
                  <td>
                    <span
                      className={`badge ${lp.active ? "badge-active" : "badge-inactive"}`}
                    >
                      {lp.active ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => window.open(`/l/${lp.slug}`, "_blank")}
                      className="action-btn view"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/landing-pages/${lp.id}/editar`)
                      }
                      className="action-btn edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(lp.id, lp.title)}
                      className="action-btn delete"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
