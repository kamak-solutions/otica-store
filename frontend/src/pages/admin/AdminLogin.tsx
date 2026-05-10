import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/admin-auth.service";
import { useAdminAuth } from "../../store/auth/use-admin-auth";

export function AdminLogin() {
  const navigate = useNavigate();
  const { signIn } = useAdminAuth();

  const [email, setEmail] = useState("admin@oticashowroom.com");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await adminLogin({
        email,
        password,
      });

      signIn(response.data.token, response.data.user);
      navigate("/admin/orcamentos");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao entrar no admin.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <span>Admin</span>
        <h1>Entrar no painel</h1>
        <p>Acesse o painel administrativo da Ótica ShowRoom.</p>

        {errorMessage && (
          <div className="admin-login-error">{errorMessage}</div>
        )}

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
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
