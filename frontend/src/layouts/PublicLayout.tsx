import { Link, Outlet } from "react-router-dom";

export function PublicLayout() {
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
          <Link className="public-logo" to="/">
            Ótica ShowRoom
          </Link>

          <nav className="public-nav">
            <Link to="/">Início</Link>
            <Link to="/armacoes">Armações</Link>
            <Link to="/lentes">Lentes</Link>
            <Link to="/servicos">Serviços</Link>
            <Link to="/blog">Blog</Link>
            <Link className="nav-quote-button" to="/orcamento">
              Orçamento
            </Link>
          </nav>

          <div className="public-header-actions" aria-label="Ações rápidas">
            <button type="button" aria-label="Buscar">
              🔎
            </button>
            <button type="button" aria-label="Entrar">
              👤
            </button>
            <button type="button" aria-label="Carrinho">
              🛒
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
        Óculos, armações, lentes e acessórios com atendimento personalizado para
        sua receita e seu estilo.
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
