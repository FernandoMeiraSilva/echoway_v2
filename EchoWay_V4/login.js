// Login de demonstração: não valida nada, só libera o painel de avisos.
document.getElementById('form-login').addEventListener('submit', function (e) {
  e.preventDefault();
  salvarLogin();
  window.location.href = 'painel.html';
});
