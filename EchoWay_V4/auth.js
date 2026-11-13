// Login de demonstração: só guarda no navegador que a pessoa "entrou".
var CHAVE_LOGIN = 'echoway-logado';
function estaLogado() {
  try { return sessionStorage.getItem(CHAVE_LOGIN) === '1'; } catch (e) { return false; }
}
function salvarLogin() {
  try { sessionStorage.setItem(CHAVE_LOGIN, '1'); } catch (e) {}
}
function apagarLogin() {
  try { sessionStorage.removeItem(CHAVE_LOGIN); } catch (e) {}
}
