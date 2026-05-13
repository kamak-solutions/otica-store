import { useEffect, useState } from "react";
import {
  createAdminUser,
  listAdminUsers,
  updateAdminUserActive,
  updateAdminUserRole,
  type AdminUser,
  type AdminUserRole,
} from "../../services/admin-users.service";

const roleLabels: Record<AdminUserRole, string> = {
  owner: "Owner",
  admin: "Admin",
  collaborator: "Colaborador",
  viewer: "Visualizador",
};

const roleOptions: AdminUserRole[] = ["owner", "admin", "collaborator", "viewer"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminUserRole>("viewer");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [actionUserId, setActionUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadUsers() {
    try {
      setErrorMessage("");

      const response = await listAdminUsers();

      setUsers(response.data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao carregar usuários admin.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsCreating(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createAdminUser({
        name,
        email,
        password,
        role,
      });

      setName("");
      setEmail("");
      setPassword("");
      setRole("viewer");
      setSuccessMessage("Usuário admin criado com sucesso.");

      await loadUsers();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao criar usuário admin.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleRoleChange(userId: string, nextRole: AdminUserRole) {
    setActionUserId(userId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateAdminUserRole(userId, nextRole);
      setSuccessMessage("Perfil do usuário atualizado com sucesso.");

      await loadUsers();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao alterar perfil do usuário.",
      );
    } finally {
      setActionUserId("");
    }
  }

  async function handleToggleActive(user: AdminUser) {
    setActionUserId(user.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateAdminUserActive(user.id, !user.active);
      setSuccessMessage("Status do usuário atualizado com sucesso.");

      await loadUsers();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Erro ao alterar status do usuário.",
      );
    } finally {
      setActionUserId("");
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>
          <h1>Usuários</h1>
          <p>Gerencie acessos administrativos, papéis e status dos usuários.</p>
        </div>

        <button type="button" onClick={loadUsers}>
          Atualizar
        </button>
      </div>

      {errorMessage && (
        <p className="admin-state-message admin-error-message">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p className="admin-state-message admin-success-message">
          {successMessage}
        </p>
      )}

      <form className="admin-users-form" onSubmit={handleCreateUser}>
        <h2>Novo usuário admin</h2>

        <div className="admin-users-form-grid">
          <label>
            Nome
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Senha temporária
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </label>

          <label>
            Perfil
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as AdminUserRole)}
            >
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {roleLabels[option]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit" disabled={isCreating}>
          {isCreating ? "Criando..." : "Criar usuário"}
        </button>
      </form>

      {isLoading && (
        <p className="admin-state-message">Carregando usuários...</p>
      )}

      {!isLoading && users.length === 0 && (
        <p className="admin-state-message">Nenhum usuário admin encontrado.</p>
      )}

      <div className="admin-users-list">
        {users.map((user) => (
          <article className="admin-user-card" key={user.id}>
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
              <small>Criado em {formatDate(user.createdAt)}</small>
            </div>

            <div className="admin-user-controls">
              <span
                className={
                  user.active ? "admin-user-status active" : "admin-user-status"
                }
              >
                {user.active ? "Ativo" : "Inativo"}
              </span>

              <select
                value={user.role}
                disabled={actionUserId === user.id}
                onChange={(event) =>
                  handleRoleChange(user.id, event.target.value as AdminUserRole)
                }
              >
                {roleOptions.map((option) => (
                  <option key={option} value={option}>
                    {roleLabels[option]}
                  </option>
                ))}
              </select>

              <button
                type="button"
                disabled={actionUserId === user.id}
                onClick={() => handleToggleActive(user)}
              >
                {user.active ? "Desativar" : "Ativar"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
