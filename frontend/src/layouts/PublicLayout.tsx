import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useCart } from "../store/cart/use-cart";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21C5.5 16.5 8.5 14 12 14C15.5 14 18.5 16.5 20 21" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5H6L8.2 15.5H18.5L20 8H7" />
      <circle cx="10" cy="20" r="1.6" />
      <circle cx="17" cy="20" r="1.6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7H20" />
      <path d="M4 12H20" />
      <path d="M4 17H20" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

export function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

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
            <button type="button" aria-label="Buscar">
              <SearchIcon />
            </button>

            <button type="button" aria-label="Entrar">
              <UserIcon />
            </button>

            <Link
              className="header-cart-button"
              to="/carrinho"
              aria-label="Carrinho"
            >
              <CartIcon />
              {totalItems > 0 && <span>{totalItems}</span>}
            </Link>
            <button
              className="mobile-menu-button"
              type="button"
              aria-label="Abrir menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((current) => !current)}
            >
             {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

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
              <a href="#" aria-label="Instagram">
                Instagram
              </a>
              <a href="#" aria-label="Facebook">
                Facebook
              </a>
              <a href="#" aria-label="X">
                X
              </a>
              <a href="#" aria-label="YouTube">
                YouTube
              </a>
              <a href="#" aria-label="LinkedIn">
                LinkedIn
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
              <span>Pix</span>
              <span>Visa</span>
              <span>Mastercard</span>
              <span>Elo</span>
              <span>Boleto</span>
            </div>
          </div>

          <div>
            <strong>Segurança</strong>

            <div className="payment-icons">
              <span>SSL</span>
              <span>Compra segura</span>
            </div>
          </div>
        </div>

        <div className="site-container footer-bottom">
          <span>© oticashowroom.com.br</span>
          <span>by Kamak Solutions</span>
        </div>
      </footer>
    </div>
  );
}
