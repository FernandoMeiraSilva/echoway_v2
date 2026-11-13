'use strict';

// Endereço que recebe as mensagens do formulário de contato.
// Para enviar por um servidor, troque o mailto em initContactForm() por um fetch().
const CONTACT_EMAIL = 'contato@echoway.com.br';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function initNav() {
  const navbar = $('#navbar');
  const toggle = $('#hamburger');
  const links = $('#navLinks');

  // A navbar ganha fundo depois que a página sai do topo.
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;height:40px;width:1px;pointer-events:none';
  document.body.prepend(sentinel);
  new IntersectionObserver(([entry]) => {
    navbar.classList.toggle('scrolled', !entry.isIntersecting);
  }).observe(sentinel);

  const setMenu = (open) => {
    toggle.classList.toggle('active', open);
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  };

  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('a', links).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Destaca no menu a seção que está na tela.
  const menuLinks = $$('.nav-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e) => {
      menuLinks.forEach((a) => a.classList.toggle('active', a.hash === `#${e.target.id}`));
    });
  }, { threshold: 0.45 });
  $$('section[id]').forEach((s) => sectionObserver.observe(s));
}

function initFaq() {
  const questions = $$('.faq-question');

  const setOpen = (button, open) => {
    button.setAttribute('aria-expanded', String(open));
    button.closest('.faq-item').classList.toggle('open', open);
    document.getElementById(button.getAttribute('aria-controls')).classList.toggle('open', open);
  };

  questions.forEach((button) => {
    button.addEventListener('click', () => {
      const willOpen = button.getAttribute('aria-expanded') !== 'true';
      questions.forEach((q) => setOpen(q, false));
      setOpen(button, willOpen);
    });
  });
}

function initSimulator() {
  const simulator = $('#interactiveSimulator');
  const controller = $('#stepsController');
  if (!simulator || !controller) return;

  const STEP_MS = 4200;
  const steps = $$('.step-control-item', controller);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 1;
  let timer = null;
  let pinned = false;

  const show = (n) => {
    current = n;
    simulator.dataset.step = n;
    steps.forEach((s) => s.classList.toggle('active', Number(s.dataset.step) === n));
  };
  const stop = () => clearInterval(timer);
  const play = () => {
    stop();
    if (!reduceMotion.matches && !document.hidden) {
      timer = setInterval(() => show((current % steps.length) + 1), STEP_MS);
    }
  };

  steps.forEach((s) => s.addEventListener('click', () => {
    pinned = true;
    stop();
    show(Number(s.dataset.step));
  }));

  // Pausa enquanto o mouse está sobre o simulador. Se o usuário escolheu um passo,
  // a troca automática só volta quando ele sai da seção inteira.
  [simulator, controller].forEach((el) => {
    el.addEventListener('mouseenter', stop);
    el.addEventListener('mouseleave', () => { if (!pinned) play(); });
  });
  $('#how-it-works').addEventListener('mouseleave', () => {
    pinned = false;
    play();
  });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));

  show(1);
  play();
}

// Cada resposta tem os padrões que a ativam. A primeira que casar vence,
// então as mais específicas ficam no topo. \b evita casar "oi" dentro de "pois".
const CHAT_REPLIES = [
  {
    patterns: [/\b(pre[çc]o|valor|custa|quanto|parcel\w*)\b/i],
    answer: 'O EchoWay Completo custa R$ 299 à vista, ou em até 10x sem juros no cartão. Vem com 1 campainha, 1 pulseira EchoBand e notificações ilimitadas no Telegram.',
  },
  {
    patterns: [/\b(frete|entrega|envio|prazo)\b/i],
    answer: 'Entregamos em todo o Brasil. O frete é grátis para compras acima de R$ 400.',
  },
  {
    patterns: [/\b(garantia|troca|devol\w+)\b/i],
    answer: 'Você tem 12 meses de garantia e 7 dias para troca ou devolução.',
  },
  {
    patterns: [/\b(alcance|dist[âa]ncia|metros)\b/i],
    answer: 'O alcance é de até 50 m pelo Wi-Fi da sua casa. Paredes e outros obstáculos podem reduzir esse valor.',
  },
  {
    patterns: [/\b(pulseira|echoband|bateria|pulso)\b/i],
    answer: 'A EchoBand vibra forte e tem um LED visível. A bateria dura até 48 horas e a recarga é por cabo USB-C.',
  },
  {
    patterns: [/\b(telegram|notifica\w+|aviso)\b/i],
    answer: 'Você cadastra seu usuário do Telegram no app EchoWay. Toda vez que a campainha toca, o bot do EchoWay envia uma mensagem.',
  },
  {
    patterns: [/\b(instal\w+|configur\w+)\b/i],
    answer: 'A instalação leva cerca de 20 minutos. Vem com guia ilustrado e videoaulas passo a passo.',
  },
  {
    patterns: [/\b(comprar|quero|adquirir|pedido)\b/i],
    answer: 'Para comprar, vá até a seção "Comprar o EchoWay" e fale com a gente pelo formulário de contato.',
  },
  {
    patterns: [/\bfunciona\w*\b/i, /\bcomo\b/i],
    answer: 'Quando alguém aperta a campainha, o sinal vai pelo Wi-Fi até a pulseira e o celular. A pulseira vibra, o LED pisca e você recebe uma mensagem no Telegram.',
  },
  {
    patterns: [/\b(ol[áa]|oi|bom dia|boa tarde|boa noite)\b/i],
    answer: 'Olá! O que você quer saber sobre o EchoWay?',
  },
];
const CHAT_FALLBACK = 'Não entendi bem. Pergunte sobre preço, pulseira, Telegram, alcance, garantia, frete ou instalação.';

const chatReply = (text) =>
  (CHAT_REPLIES.find((r) => r.patterns.some((p) => p.test(text))) || { answer: CHAT_FALLBACK }).answer;

function initChat() {
  const bubble = $('#chatbotBubble');
  const win = $('#chatbotWindow');
  const closeBtn = $('#chatbotClose');
  const messages = $('#chatbotMessages');
  const input = $('#chatInput');
  const sendBtn = $('#chatSend');

  const setOpen = (open) => {
    win.classList.toggle('open', open);
    bubble.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
  };

  const addMessage = (text, fromBot) => {
    const row = document.createElement('div');
    row.className = `chat-message ${fromBot ? 'bot-msg' : 'user-msg'}`;
    const bubbleEl = document.createElement('div');
    bubbleEl.className = 'msg-bubble';
    bubbleEl.textContent = text;
    row.append(bubbleEl);
    messages.append(row);
    messages.scrollTop = messages.scrollHeight;
  };

  const send = (text) => {
    text = text.trim();
    if (!text) return;
    $('#quickReplies')?.remove();
    addMessage(text, false);
    input.value = '';
    setTimeout(() => addMessage(chatReply(text), true), 400);
  };

  bubble.addEventListener('click', () => setOpen(!win.classList.contains('open')));
  closeBtn.addEventListener('click', () => { setOpen(false); bubble.focus(); });
  win.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { setOpen(false); bubble.focus(); }
  });
  sendBtn.addEventListener('click', () => send(input.value));
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(input.value); });
  $$('.quick-reply').forEach((b) => b.addEventListener('click', () => send(b.dataset.msg)));
}

function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const body = [
      data.get('message'),
      '',
      `Nome: ${data.get('name')}`,
      `E-mail: ${data.get('email')}`,
      data.get('phone') ? `Telegram: ${data.get('phone')}` : '',
    ].filter((line, i, all) => line || i < all.length - 1).join('\n');

    const subject = `Contato pelo site – ${data.get('name')}`;
    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

initNav();
initFaq();
initSimulator();
initChat();
initContactForm();
