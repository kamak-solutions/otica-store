import { Link } from "react-router-dom";

export function PrivacyPolicy() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <span>Privacidade</span>
        <h1>Política de Privacidade</h1>
        <p>
          Entenda como a Ótica ShowRoom coleta, utiliza e protege seus dados
          pessoais durante o atendimento, orçamento e finalização de pedidos.
        </p>
      </section>

      <section className="site-container privacy-policy-content">
        <article>
          <h2>1. Quem somos</h2>
          <p>
            A Ótica ShowRoom é uma plataforma online para apresentação de
            produtos ópticos, solicitação de orçamentos, envio de receitas e
            criação de pedidos.
          </p>
        </article>

        <article>
          <h2>2. Quais dados coletamos</h2>
          <p>
            Podemos coletar dados como nome completo, e-mail, telefone, CPF,
            data de nascimento, endereço, informações do pedido, observações
            enviadas pelo cliente e arquivos de receita quando enviados
            voluntariamente.
          </p>
        </article>

        <article>
          <h2>3. Para que usamos seus dados</h2>
          <p>
            Utilizamos seus dados para identificar o cliente, confirmar
            maioridade, criar pedidos, realizar atendimento, calcular ou
            combinar entrega, analisar solicitações de orçamento e dar
            continuidade ao relacionamento comercial solicitado por você.
          </p>
        </article>

        <article>
          <h2>4. Dados de receita óptica</h2>
          <p>
            Quando você envia uma receita, usamos o arquivo apenas para análise
            e atendimento relacionados ao orçamento ou pedido solicitado. Evite
            enviar informações que não sejam necessárias para esse atendimento.
          </p>
        </article>

        <article>
          <h2>5. Compartilhamento de dados</h2>
          <p>
            Seus dados podem ser utilizados por ferramentas necessárias para a
            operação da loja, como hospedagem, banco de dados, armazenamento de
            imagens e sistemas de atendimento. Não vendemos seus dados pessoais.
          </p>
        </article>

        <article>
          <h2>6. Segurança</h2>
          <p>
            Adotamos medidas técnicas e administrativas para proteger os dados,
            como controle de acesso administrativo, autenticação, auditoria de
            ações sensíveis, validação de arquivos enviados e restrição de
            acesso às informações internas.
          </p>
        </article>

        <article>
          <h2>7. Seus direitos</h2>
          <p>
            Você pode solicitar confirmação de tratamento, acesso, correção,
            atualização, anonimização, bloqueio, eliminação quando aplicável,
            informação sobre compartilhamento e revogação de consentimento,
            conforme previsto na legislação de proteção de dados.
          </p>
        </article>

        <article>
          <h2>8. Retenção dos dados</h2>
          <p>
            Mantemos os dados pelo tempo necessário para cumprir as finalidades
            do atendimento, obrigações legais, segurança, prevenção a fraudes e
            registro de pedidos. Quando possível e aplicável, dados podem ser
            eliminados, anonimizados ou bloqueados.
          </p>
        </article>

        <article>
          <h2>9. Atendimento sobre privacidade</h2>
          <p>
            Para solicitações sobre seus dados pessoais, entre em contato pelo
            canal oficial de atendimento da Ótica ShowRoom. Informe seu nome,
            e-mail e o tipo de solicitação para que possamos localizar e
            analisar o pedido.
          </p>
        </article>

        <article>
          <h2>10. Atualizações desta política</h2>
          <p>
            Esta política pode ser atualizada para refletir mudanças no sistema,
            nos serviços ou em exigências legais. Recomendamos consultar esta
            página periodicamente.
          </p>
        </article>

        <div className="privacy-policy-actions">
          <Link className="button-primary" to="/orcamento">
            Solicitar orçamento
          </Link>

          <Link className="button-secondary" to="/">
            Voltar para a vitrine
          </Link>
        </div>
      </section>
    </main>
  );
}
