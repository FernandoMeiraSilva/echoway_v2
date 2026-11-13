// Login de demonstração: não valida nada, só libera o painel e leva à página do produto.
document.getElementById('form-login').addEventListener('submit', function (e) {
  e.preventDefault();
  salvarLogin();
  window.location.href = 'index.html';
});
