
    (function () {
      // 1. CONFIGURAÇÃO CENTRAL DO WHATSAPP (Substitua pelo número da sua loja)
      const WHATSAPP_NUMERO = "5511963208855"; // Formato internacional: DDI (55) + DDD + Telefone sem espaços

      const MENSAGENS_WA = {
        hero: "Olá! Vi a campanha no site e quero garantir meu óculos completo por R$ 99,99 na Visão 99.",
        nav: "Olá! Gostaria de mais informações sobre as armações da campanha Visão 99.",
        receita: "Olá, equipe Ótica ShowRoom! Estou enviando a foto da minha receita para validação na campanha Visão 99.",
        final: "Olá! Quero reservar minha armação da campanha Visão 99 antes que termine o lote promocional.",
        float: "Olá! Tenho uma dúvida sobre a campanha Visão 99.",
        footer: "Olá! Gostaria de conversar com um atendente óptico sobre a campanha Visão 99."
      };

      function gerarLinkWhatsApp(mensagem) {
        return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
      }

      // Aplica os links dinâmicos do WhatsApp
      document.querySelectorAll(".wa-btn").forEach(function (btn) {
        const intent = btn.getAttribute("data-intent") || "hero";
        const msg = MENSAGENS_WA[intent] || MENSAGENS_WA.hero;
        btn.href = gerarLinkWhatsApp(msg);
      });

      // 2. CONTROLE DO MODAL DE REGULAMENTO
      const modal = document.getElementById("modal-regulamento");
      const openTriggers = document.querySelectorAll(".open-modal-trigger");
      const closeBtn = document.getElementById("close-modal-btn");

      function abrirModal(e) {
        if (e) e.preventDefault();
        modal.classList.add("active");
        document.body.style.overflow = "hidden"; // Trava a rolagem da página
      }

      function fecharModal() {
        modal.classList.remove("active");
        document.body.style.overflow = ""; // Libera a rolagem
      }

      openTriggers.forEach(function (trigger) {
        trigger.addEventListener("click", abrirModal);
      });

      if (closeBtn) closeBtn.addEventListener("click", fecharModal);

      // Fecha ao clicar fora do card
      modal.addEventListener("click", function (e) {
        if (e.target === modal) fecharModal();
      });

      // Fecha ao apertar tecla Esc
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.classList.contains("active")) {
          fecharModal();
        }
      });

      // 3. FAQ ACORDEON EXCLUSIVO
      const faqRows = document.querySelectorAll(".faq-row");
      faqRows.forEach(function (item) {
        item.addEventListener("toggle", function () {
          if (item.open) {
            faqRows.forEach(function (other) {
              if (other !== item) other.open = false;
            });
          }
        });
      });
    })();
  