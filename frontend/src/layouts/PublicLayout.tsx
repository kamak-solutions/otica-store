import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useCart } from "../store/cart/use-cart";
import { MiniCart } from "../components/public/MiniCart";

export function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = searchTerm.trim();

    if (!value) return;

    navigate(`/produtos?busca=${encodeURIComponent(value)}`);

    setShowSearch(false);
    setSearchTerm("");
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="public-shell">
      <div className="top-marquee">
        <div className="site-container top-marquee-inner">
          <div className="marquee-track">
            <span>Envie sua receita para orçamento</span>
            <span>•</span>
            <span>Promoção do mês: Varilux em dobro</span>
            <span>•</span>
            <span>Ajustes, consertos e manutenção de óculos</span>
            <span>•</span>
            <span>Atendimento personalizado para lentes de grau</span>
          </div>
        </div>
      </div>

      <header className="public-header">
        <div className="site-container public-header-inner">
          <Link className="public-logo" to="/" onClick={closeMobileMenu}>
            Ótica ShowRoom
          </Link>

          <nav
            className={
              isMobileMenuOpen ? "public-nav public-nav-open" : "public-nav"
            }
          >
            <Link to="/" onClick={closeMobileMenu}>
              Início
            </Link>

            <Link to="/armacoes" onClick={closeMobileMenu}>
              Armações
            </Link>

            <Link to="/lentes" onClick={closeMobileMenu}>
              Lentes
            </Link>

            <Link to="/servicos" onClick={closeMobileMenu}>
              Serviços
            </Link>

            <Link to="/blog" onClick={closeMobileMenu}>
              Blog
            </Link>

            <Link
              className="nav-quote-button"
              to="/orcamento"
              onClick={closeMobileMenu}
            >
              Orçamento
            </Link>
          </nav>

          <div className="public-header-actions" aria-label="Ações rápidas">
            <button
              type="button"
              aria-label="Buscar"
              onClick={() => setShowSearch((current) => !current)}
            >
              <img src="/icons/search.png" alt="" className="header-icon" />
            </button>
            <button type="button" aria-label="Entrar">
              <img src="/icons/user.svg" alt="" className="header-icon" />
            </button>
            <div className="header-cart-wrapper">
              <button
                type="button"
                className="header-cart-button"
                onClick={() => setIsMiniCartOpen((current) => !current)}
                aria-label="Carrinho"
              >
                <img src="/icons/cart.png" alt="" className="header-icon" />

                {totalItems > 0 && <span>{totalItems}</span>}
              </button>

              {isMiniCartOpen && <MiniCart />}
            </div>

            <button
              className="mobile-menu-button"
              type="button"
              aria-label="Abrir menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((current) => !current)}
            >
              <img
                src={isMobileMenuOpen ? "/icons/close.svg" : "/icons/menu.svg"}
                alt=""
                className="header-icon"
              />
            </button>
          </div>
        </div>
      </header>
      {showSearch && (
        <div className="header-search-popup">
          <form className="header-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              autoFocus
            />

            <button type="submit">Buscar</button>
          </form>
        </div>
      )}

      <Outlet />

      <footer className="public-footer">
        <div className="site-container public-footer-inner">
          <div className="footer-brand-column">
            <strong>Ótica ShowRoom</strong>
            <p>
              Óculos, armações, lentes e acessórios com atendimento
              personalizado para sua receita e seu estilo.
            </p>

            <div className="footer-socials">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <img src="/icons/social/instagram.png" alt="Instagram" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <img src="/icons/social/facebook.png" alt="Facebook" />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
              >
                <img src="/icons/social/x.png" alt="X" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Youtube"
              >
                <img src="/icons/social/youtube.png" alt="Youtube" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Linkedin"
              >
                <img src="/icons/social/linkedin.png" alt="Linkedin" />
              </a>
            </div>
          </div>

          <div>
            <strong>Produtos</strong>
            <Link to="/armacoes">Armações</Link>
            <a href="/#categorias">Óculos Solar</a>
            <a href="/#categorias">Óculos de Grau</a>
            <Link to="/lentes">Lentes</Link>
            <a href="/#categorias">Acessórios</a>
          </div>

          <div>
            <strong>Serviços</strong>
            <Link to="/orcamento">Orçamento com receita</Link>
            <Link to="/servicos">Montagem de óculos</Link>
            <Link to="/servicos">Coloração de lentes</Link>
            <Link to="/servicos">Consertos e ajustes</Link>
            <Link to="/servicos">Atacado</Link>
          </div>

          <div>
            <strong>Institucional</strong>
            <a href="#">Quem Somos</a>
            <a href="#">Conheça nossas Lojas</a>
            <a href="#">Trocas e Devoluções</a>
            <a href="#">Atendimento</a>
            <a href="#">Mapa do Site</a>
            <a href="#">Termos e condições de compras</a>
          </div>

          <div>
            <strong>Informações</strong>
            <a href="#">Programa de Afiliados</a>
            <a href="#">Política de Privacidade</a>
            <a href="#">Entregas</a>
            <Link to="/orcamento">Envio de Receita</Link>
            <a href="#">Diretrizes das Promoções</a>
            <a href="#">Atacado</a>
          </div>
        </div>

        <div className="site-container footer-payment-area">
          <div>
            <strong>Formas de pagamento</strong>

            <div className="payment-icons">
              <img src="/icons/payments/pix.png" alt="Pix" />
              <img src="/icons/payments/visa.png" alt="Visa" />
              <img src="/icons/payments/mastercard.png" alt="Mastercard" />
              <img src="/icons/payments/elo.png" alt="Elo" />
              <img src="/icons/payments/boleto.png" alt="Boleto" />
            </div>
          </div>

          <div>
            <strong>Segurança</strong>

            <div className="payment-icons">
              <img
                src="/icons/security/ssl.png"
                alt="Certificado SSL"
                title="Certificado SSL"
              />

              <img
                src="/icons/security/secure-shopping.png"
                alt="Compra segura"
                title="Compra segura"
              />
            </div>
          </div>
        </div>

        <div className="site-container footer-bottom">
          <span>© oticashowroom.com.br</span>
            <span>© oticashowroom.com.br</span>
          <span>by Kamak Solutions</span>
        </div>
      </footer>
    </div>
  );
}
