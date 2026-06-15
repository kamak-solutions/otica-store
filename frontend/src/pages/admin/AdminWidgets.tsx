import { useEffect, useState } from "react";
import {
  listWidgets,
  deleteWidget,
  type Widget,
} from "../../services/widget.service";

import { Link } from "react-router-dom";

export function AdminWidgets() {
  const [widgets, setWidgets] = useState<Widget[]>([]);

  async function load() {
    const data = await listWidgets();

    setWidgets(data.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Excluir widget?")) return;

    await deleteWidget(id);

    load();
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>

          <h1>Widgets</h1>

          <p>Gerencie espaços promocionais.</p>
        </div>

        <Link to="/admin/widgets/novo">
          <button>Novo widget</button>
        </Link>
      </div>

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Posição</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {widgets.map((widget) => (
              <tr key={widget.id}>
                <td>{widget.name}</td>

                <td>{widget.type}</td>

                <td>{widget.position}</td>

                <td>{widget.active ? "🟢" : "🔴"}</td>

                <td>
                  <button onClick={() => remove(widget.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
