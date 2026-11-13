// Pedido de demonstração: não envia nada, só mostra a confirmação.
var formPedido = document.getElementById('form-pedido');
if (formPedido) {
  formPedido.addEventListener('submit', function (e) {
    e.preventDefault();
    formPedido.hidden = true;
    document.getElementById('pedido-ok').hidden = false;
  });
}
