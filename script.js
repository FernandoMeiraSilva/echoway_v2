/* EchoWay – script.js */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     PARTICLES BACKGROUND
  ============================================================ */
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        border-radius: 50%;
        background: ${Math.random() > 0.5 ? 'rgba(108,99,255,0.4)' : 'rgba(15,212,196,0.3)'};
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: particle-drift ${6 + Math.random() * 8}s ease-in-out infinite;
        animation-delay: ${Math.random() * 6}s;
      `;
      particlesContainer.appendChild(p);
    }
    const style = document.createElement('style');
    style.textContent = `
      @keyframes particle-drift {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
        33% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.5); opacity: 0.8; }
        66% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(0.8); opacity: 0.2; }
      }
    `;
    document.head.appendChild(style);
  }


  /* ============================================================
     NAVBAR SCROLL EFFECT
  ============================================================ */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });


  /* ============================================================
     HAMBURGER MENU
  ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ============================================================
     SCROLL ANIMATIONS (AOS LITE)
  ============================================================ */
  const aosElements = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-visible');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  aosElements.forEach(el => observer.observe(el));


  /* ============================================================
     FAQ ACCORDION
  ============================================================ */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answerId = btn.id + '-answer';
      const answer = document.getElementById(answerId);
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        const openAnswerId = openItem.querySelector('.faq-question').id + '-answer';
        const openAnswer = document.getElementById(openAnswerId);
        if (openAnswer) openAnswer.classList.remove('open');
      });

      // Toggle clicked
      if (!isOpen && answer) {
        item.classList.add('open');
        answer.classList.add('open');
      }
    });
  });


  /* ============================================================
     CONTACT FORM SUBMISSION
  ============================================================ */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 0.7s linear infinite"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path d="M9 12l2 2 4-4"/></svg> Enviando...`;
      btn.style.opacity = '0.8';
      btn.disabled = true;

      setTimeout(() => {
        const wrap = document.querySelector('.contact-form-wrap');
        wrap.innerHTML = `
          <div class="form-success">
            <div class="success-icon">✓</div>
            <h4>Mensagem Enviada!</h4>
            <p>Obrigado pelo contato. Nossa equipe retornará em até 24 horas pelo e-mail ou Telegram que você informou.</p>
          </div>`;
      }, 1800);
    });
  }


  /* ============================================================
     CHATBOT
  ============================================================ */
  const chatbotBubble  = document.getElementById('chatbotBubble');
  const chatbotWindow  = document.getElementById('chatbotWindow');
  const chatbotClose   = document.getElementById('chatbotClose');
  const chatMessages   = document.getElementById('chatbotMessages');
  const chatInput      = document.getElementById('chatInput');
  const chatSend       = document.getElementById('chatSend');

  const BOT_RESPONSES = {
    default: "Desculpe, não entendi bem. Pode reformular? Você também pode me perguntar sobre o preço, pulseira, Telegram, garantia ou instalação 😊",
    greetings: ['olá', 'oi', 'boa tarde', 'bom dia', 'boa noite', 'hey', 'hello'],
    keywords: [
      {
        keys: ['como funciona', 'funciona', 'como'],
        reply: "🔔 O EchoWay funciona em 3 passos:\n1. Alguém aperta a campainha\n2. O sinal vai via Wi-Fi para a pulseira\n3. Você sente a vibração, vê o LED piscar E recebe notificação no Telegram!\nSimples assim 🙌"
      },
      {
        keys: ['preço', 'preco', 'valor', 'custa', 'quanto', 'plano'],
        reply: "💰 O EchoWay Completo custa apenas **R$299,00** à vista!\nInclui 1 campainha + 1 pulseira EchoBand + notificações Telegram ilimitadas. Parcelamos em até 12x no cartão! 💳"
      },
      {
        keys: ['pulseira', 'echoband', 'band', 'pulso'],
        reply: "⌚ A EchoBand tem:\n• Bateria para 2 dias\n• Vibração de alta intensidade\n• LED de alta visibilidade\n• Recarga magnética USB-C em ~1.5h"
      },
      {
        keys: ['telegram', 'notificação', 'notificacao', 'mensagem', 'aviso'],
        reply: "📲 A notificação vai direto no Telegram! Basta cadastrar seu usuário no app EchoWay. Sempre que a campainha for acionada, você recebe um aviso automático pelo nosso bot."
      },
      {
        keys: ['alcance', 'distancia', 'distância', 'metros'],
        reply: "📡 O EchoWay tem alcance de até 50 metros via Wi-Fi doméstico. Funciona em toda a casa, quintal e vizinhança próxima. Fora de casa, a notificação chega pelo Telegram!"
      },
      {
        keys: ['garantia', 'devolver', 'devolucao', 'troca'],
        reply: "🛡️ Oferecemos:\n• 12 meses de garantia total\n• 30 dias para troca/devolução sem perguntas\n• Suporte especializado incluído"
      },
      {
        keys: ['frete', 'entrega', 'envio', 'prazo'],
        reply: "🚚 Entregamos em todo o Brasil!\n• Frete Grátis para compras acima de R$400\n• Prazo de 3-7 dias úteis para capitais\n• Rastreamento em tempo real\n• Embalagem discreta e segura 📦"
      },
      {
        keys: ['instalar', 'instalação', 'instalacao', 'configurar', 'configuração'],
        reply: "🔧 A instalação é simples! Levamos em média 20 minutos:\n• Guia ilustrado enviado com o produto\n• Vídeo-aulas passo a passo\n• Suporte dedicado online"
      },
      {
        keys: ['comprar', 'quero', 'adquirir', 'pedir', 'pedido'],
        reply: "🛒 Ótimo! Para comprar, role a página até a seção **\"Comprar Online\"**. Aceitamos cartão (até 12x), Pix e boleto. Qualquer dúvida, estamos à disposição! 👇"
      }
    ]
  };

  function isGreeting(msg) {
    return BOT_RESPONSES.greetings.some(g => msg.toLowerCase().includes(g));
  }

  function getBotReply(msg) {
    const lc = msg.toLowerCase();
    if (isGreeting(lc)) {
      return `Olá! 👋 Tudo bem? Sou o EchoBot e estou aqui para te ajudar com tudo sobre o EchoWay. O que você gostaria de saber?`;
    }
    for (const item of BOT_RESPONSES.keywords) {
      if (item.keys.some(k => lc.includes(k))) {
        return item.reply;
      }
    }
    return BOT_RESPONSES.default;
  }

  function appendMessage(text, isBot) {
    const div = document.createElement('div');
    div.className = `chat-message ${isBot ? 'bot-msg' : 'user-msg'}`;
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    // Handle newlines and bold text
    bubble.innerHTML = text
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    div.appendChild(bubble);
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-message bot-msg typing-msg';
    div.innerHTML = `<div class="msg-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    // Remove quick replies
    const qr = document.getElementById('quickReplies');
    if (qr) qr.remove();
    appendMessage(text, false);
    chatInput && (chatInput.value = '');
    const typing = showTyping();
    setTimeout(() => {
      typing.remove();
      appendMessage(getBotReply(text), true);
    }, 900 + Math.random() * 400);
  }

  chatbotBubble?.addEventListener('click', () => {
    chatbotWindow.classList.toggle('open');
  });
  chatbotClose?.addEventListener('click', () => {
    chatbotWindow.classList.remove('open');
  });

  chatSend?.addEventListener('click', () => sendMessage(chatInput.value));
  chatInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage(chatInput.value);
  });

  document.querySelectorAll('.quick-reply').forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.getAttribute('data-msg')));
  });

  // Auto-show chatbot after 12 seconds
  setTimeout(() => {
    if (!chatbotWindow.classList.contains('open')) {
      chatbotWindow.classList.add('open');
    }
  }, 12000);


  /* ============================================================
     INTERACTIVE SIMULATOR FOR "COMO FUNCIONA"
     ============================================================ */
  const simulator = document.getElementById('interactiveSimulator');
  const controller = document.getElementById('stepsController');
  const cursor = document.getElementById('simCursor');
  
  if (simulator && controller && cursor) {
    const stepItems = controller.querySelectorAll('.step-control-item');
    let currentStep = 1;
    let autoplayInterval = null;
    let progress = 0;
    let isPaused = false;
    let isUserInteracted = false;
    const STEP_DURATION = 4200; // 4.2 seconds per step
    const TICK_INTERVAL = 30; // update progress every 30ms
    
    function setStep(stepNum) {
      currentStep = stepNum;
      
      // Update UI classes
      stepItems.forEach(item => {
        const step = parseInt(item.getAttribute('data-step'));
        if (step === stepNum) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
          const fill = item.querySelector('.progress-bar-fill');
          if (fill) fill.style.width = '0%';
        }
      });
      
      // Update simulator classes
      simulator.className = 'interactive-simulator'; // reset classes
      
      // Hide cursor by default
      cursor.style.opacity = '0';
      cursor.classList.remove('clicking');
      
      if (stepNum === 1) {
        // Step 1: Cursor moves to button and rings the doorbell
        // Position cursor at a start point (bottom-middle)
        cursor.style.transition = 'none';
        cursor.style.top = '75%';
        cursor.style.left = '45%';
        cursor.style.opacity = '0';
        
        // Force reflow
        cursor.offsetHeight;
        
        // Animate cursor moving to the doorbell button
        cursor.style.transition = 'top 0.8s cubic-bezier(0.25, 1, 0.5, 1), left 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s';
        cursor.style.opacity = '1';
        cursor.style.left = 'calc(8% + 32px)';
        cursor.style.top = '50%';
        
        // At 850ms: click
        setTimeout(() => {
          if (currentStep !== 1) return; // ensure step hasn't changed
          cursor.classList.add('clicking');
          simulator.classList.add('step-1-active');
          
          // Release click after 200ms
          setTimeout(() => {
            if (currentStep !== 1) return;
            cursor.classList.remove('clicking');
            // Fade cursor out
            cursor.style.opacity = '0';
          }, 200);
          
        }, 850);
        
      } else if (stepNum === 2) {
        // Step 2: Signal Transmitting
        simulator.classList.add('step-2-active');
      } else if (stepNum === 3) {
        // Step 3: Alert Received
        simulator.classList.add('step-3-active');
      }
      
      // Reset progress bar
      progress = 0;
    }
    
    function startAutoplay() {
      if (autoplayInterval) clearInterval(autoplayInterval);
      
      autoplayInterval = setInterval(() => {
        if (isPaused || isUserInteracted) return;
        
        progress += (TICK_INTERVAL / STEP_DURATION) * 100;
        
        if (progress >= 100) {
          progress = 0;
          let nextStep = currentStep + 1;
          if (nextStep > 3) nextStep = 1;
          setStep(nextStep);
        }
        
        // Update active progress bar
        const activeItem = controller.querySelector('.step-control-item.active');
        if (activeItem) {
          const fill = activeItem.querySelector('.progress-bar-fill');
          if (fill) fill.style.width = `${progress}%`;
        }
        
      }, TICK_INTERVAL);
    }
    
    // User interactions
    stepItems.forEach(item => {
      item.addEventListener('click', () => {
        const step = parseInt(item.getAttribute('data-step'));
        isUserInteracted = true; // Stop autoplay permanently until page reload or mouse leave
        setStep(step);
        
        // Reset and fill clicked step's progress bar to 100%, and clear others
        stepItems.forEach(sib => {
          const fill = sib.querySelector('.progress-bar-fill');
          if (fill) {
            fill.style.width = (sib === item) ? '100%' : '0%';
          }
        });
      });
    });
    
    // Pause auto-switching when hover, resume on leave (only if user hasn't clicked a step)
    simulator.addEventListener('mouseenter', () => { isPaused = true; });
    simulator.addEventListener('mouseleave', () => { isPaused = false; });
    controller.addEventListener('mouseenter', () => { isPaused = true; });
    controller.addEventListener('mouseleave', () => { isPaused = false; });
    
    // Resume autoplay loop if mouse leaves the whole "how-it-works" section, even after interaction
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.addEventListener('mouseleave', () => {
        isUserInteracted = false;
        isPaused = false;
        startAutoplay();
      });
    }
    
    // Initial run
    setStep(1);
    startAutoplay();
  }


  /* ============================================================
     SMOOTH ACTIVE NAV LINK ON SCROLL
  ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinkEls.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--accent-2)' : '';
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => sectionObserver.observe(s));


  /* ============================================================
     CSS ANIMATION: spin (for loading state)
  ============================================================ */
  const spinStyle = document.createElement('style');
  spinStyle.textContent = `@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`;
  document.head.appendChild(spinStyle);


  /* ============================================================
     HERO CTA RIPPLE EFFECT
  ============================================================ */
  document.querySelectorAll('.btn-primary, .btn-plan').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute; border-radius: 50%;
        background: rgba(255,255,255,0.25);
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size/2}px;
        top: ${e.clientY - rect.top - size/2}px;
        transform: scale(0); pointer-events: none;
        animation: ripple-effect 0.6s ease-out forwards;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `@keyframes ripple-effect { to { transform: scale(2.5); opacity: 0; } }`;
  document.head.appendChild(rippleStyle);


  /* ============================================================
     COUNT-UP ANIMATION FOR STATS
  ============================================================ */
  function animateCount(el, target, suffix) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString('pt-BR') + suffix;
    }, 20);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = [
          { id: null, el: document.querySelectorAll('.stat-num')[0], val: 12, suffix: 'k+' },
          { id: null, el: document.querySelectorAll('.stat-num')[1], val: 4.9, suffix: '★' },
          { id: null, el: document.querySelectorAll('.stat-num')[2], val: 98, suffix: '%' },
        ];
        nums.forEach(n => { if (n.el) animateCount(n.el, n.val, n.suffix); });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) statsObserver.observe(statsEl);

});
