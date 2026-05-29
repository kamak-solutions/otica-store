import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Campaign } from "../../types/campaign";

import {
  listCampaigns,
  toggleCampaign,
  deleteCampaign,
} from "../../services/campaigns.service";

export function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const [loading, setLoading] = useState(true);

  async function loadCampaigns() {
    try {
      const data = await listCampaigns();

      setCampaigns(data);
    } catch (error) {
      console.error("Erro ao carregar campanhas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(id: string) {
    try {
      await toggleCampaign(id);

      await loadCampaigns();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Deseja excluir esta campanha?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteCampaign(id);

      setCampaigns((current) =>
        current.filter((campaign) => campaign.id !== id),
      );
    } catch (error) {
      console.error(error);

      alert("Erro ao excluir campanha.");
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>

          <h1>Campanhas</h1>

          <p>Gerencie popups, promoções e avisos.</p>
        </div>

        <Link to="/admin/campanhas/nova">
          <button type="button">Nova campanha</button>
        </Link>
      </div>

      <div className="admin-table-card">
        {loading ? (
          <p>Carregando campanhas...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Local</th>
                <th>Status</th>
                <th>Delay</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td>{campaign.title}</td>

                  <td>{campaign.location}</td>

                  <td>{campaign.active ? "🟢 Ativa" : "🔴 Inativa"}</td>

                  <td>{campaign.showDelay}s</td>

                  <td>
                    <div className="campaign-actions">
                      <button
                        type="button"
                        onClick={() => handleToggle(campaign.id)}
                      >
                        {campaign.active ? "Desativar" : "Ativar"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(campaign.id)}
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
