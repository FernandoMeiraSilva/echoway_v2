var $ = function (id) { return document.getElementById(id); };
var tituloOriginal = document.title;
var piscaTitulo = null;

// Avisos das últimas 24 horas (guardados no navegador)
var CHAVE = 'echoway-avisos';
var DIA = 24 * 60 * 60 * 1000;

function ler() {
  try {
    var l = JSON.parse(localStorage.getItem(CHAVE) || '[]');
    if (!Array.isArray(l)) return [];
    // Avisos antigos eram só o horário (número); converte para o formato novo
    return l.map(function (a) {
      return typeof a === 'number' ? { t: a, teste: false } : a;
    });
  } catch (e) { return []; }
}
function gravar() {
  try { localStorage.setItem(CHAVE, JSON.stringify(avisos)); } catch (e) {}
}
var avisos = ler();

function rotulo(t) {
  var d = new Date(t);
  var h = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  var hoje = new Date();
  var ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);
  if (d.toDateString() === hoje.toDateString()) return 'Hoje, ' + h;
  if (d.toDateString() === ontem.toDateString()) return 'Ontem, ' + h;
  return d.toLocaleDateString('pt-BR') + ', ' + h;
}

function desenhar() {
  var corte = Date.now() - DIA;
  avisos = avisos.filter(function (a) { return a && typeof a.t === 'number' && a.t >= corte; });
  gravar();

  var lista = $('mensagens');
  lista.textContent = '';
  $('contagem').textContent = avisos.length === 0 ? '' :
    avisos.length === 1 ? '1 toque nas últimas 24 horas' : avisos.length + ' toques nas últimas 24 horas';

  if (avisos.length === 0) {
    var vazio = document.createElement('p');
    vazio.className = 'vazio';
    vazio.textContent = 'Nenhum toque nas últimas 24 horas.';
    lista.appendChild(vazio);
    return;
  }
  avisos.slice().reverse().forEach(function (a, i) {
    var div = document.createElement('div');
    div.className = 'msg pulseira' + (i === 0 ? ' recente' : '');
    var meta = document.createElement('small');
    meta.textContent = rotulo(a.t);
    var corpo = document.createElement('span');
    corpo.textContent = 'Campainha acionada';
    if (a.teste) {
      var tag = document.createElement('em');
      tag.className = 'tag-teste';
      tag.textContent = 'Teste';
      corpo.appendChild(tag);
    }
    div.appendChild(meta);
    div.appendChild(corpo);
    lista.appendChild(div);
  });
}

// Registra um toque na lista (para o aviso completo, use campainhaAcionada())
function adicionar(momento, teste) {
  avisos.push({ t: momento || Date.now(), teste: !!teste });
  desenhar();
}

desenhar();
setInterval(desenhar, 60000);

// Chame campainhaAcionada() sempre que a campainha for acionada.
// Só o botão "Testar aviso" passa teste = true (aparece a etiqueta "Teste").
function campainhaAcionada(teste) {
  adicionar(null, teste === true);
  var caixa = $('avisos');
  caixa.classList.add('tocando');
  $('entendi').hidden = false;
  $('lateral').scrollIntoView({ behavior: 'smooth', block: 'center' });
  if (navigator.vibrate) navigator.vibrate([400, 200, 400, 200, 400]);
  clearInterval(piscaTitulo);
  var ligado = false;
  piscaTitulo = setInterval(function () {
    ligado = !ligado;
    document.title = ligado ? 'TEM ALGUÉM NA PORTA' : tituloOriginal;
  }, 700);
}

if ($('simular')) $('simular').addEventListener('click', function () { campainhaAcionada(true); });

$('entendi').addEventListener('click', function () {
  $('avisos').classList.remove('tocando');
  $('entendi').hidden = true;
  clearInterval(piscaTitulo);
  document.title = tituloOriginal;
});

// Sair: apaga o login e volta para a página de venda
$('sair').addEventListener('click', function () { apagarLogin(); });
