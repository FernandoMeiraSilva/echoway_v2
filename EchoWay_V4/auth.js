// Login de demonstração: só guarda no navegador que a pessoa "entrou".
var CHAVE_LOGIN = 'echoway-logado';
var CHAVE_TEMA = 'echoway-theme';
function estaLogado() {
  try { return sessionStorage.getItem(CHAVE_LOGIN) === '1'; } catch (e) { return false; }
}
function salvarLogin() {
  try { sessionStorage.setItem(CHAVE_LOGIN, '1'); } catch (e) {}
}
function apagarLogin() {
  try { sessionStorage.removeItem(CHAVE_LOGIN); } catch (e) {}
}

function iniciarTema() {
  var botao = document.getElementById('themeToggle');
  if (!botao) return;

  var raiz = document.documentElement;
  var aplicar = function (claro) {
    if (claro) {
      raiz.setAttribute('data-theme', 'light');
    } else {
      raiz.removeAttribute('data-theme');
    }
    botao.setAttribute('aria-pressed', String(claro));
    botao.setAttribute('aria-label', claro ? 'Mudar para tema escuro' : 'Mudar para tema claro');
    botao.setAttribute('title', claro ? 'Tema escuro' : 'Tema claro');
  };

  aplicar(raiz.getAttribute('data-theme') === 'light');

  botao.addEventListener('click', function () {
    var proximoClaro = raiz.getAttribute('data-theme') !== 'light';
    aplicar(proximoClaro);
    try {
      localStorage.setItem(CHAVE_TEMA, proximoClaro ? 'light' : 'dark');
    } catch (e) {}
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarTema);
} else {
  iniciarTema();
}
