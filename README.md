# EchoWay

Página de apresentação e venda da EchoWay, campainha inteligente para pessoas surdas ou com deficiência auditiva. Quando alguém toca a campainha, a pulseira vibra, o LED pisca e o Telegram envia um aviso.

## Rodando

Não há build nem dependências. Abra `index.html` no navegador ou sirva a pasta:

```sh
python3 -m http.server 8000
```

## Estrutura

```
index.html        página única (hero, como funciona, produto, depoimentos, compra, dúvidas, contato)
style.css         estilos, na ordem da página; tokens no :root
script.js         menu, FAQ, simulador "Como funciona", chat e formulário
assets/           imagens do produto
EchoWay_V4/       área do cliente (login e painel), independente da página
```

## Decisões

- **Sem framework nem build.** A página é estática e pequena; HTML, CSS e JS puros bastam e carregam rápido.
- **Tokens no `:root`.** Cores, raios, sombra e espaçamento ficam em variáveis. O azul de ação é `--accent-rgb`, usado também com transparência (`rgb(var(--accent-rgb) / .2)`).
- **Simulador por `data-step`.** O passo atual vem do atributo `data-step` no quadro, e o CSS reage a ele.
- **Chat por regras.** `CHAT_REPLIES` em `script.js` associa padrões a respostas; a primeira que casa vence. Não há IA nem servidor.
- **Formulário por `mailto:`.** Abre o e-mail do visitante com a mensagem preenchida. Para enviar por um servidor, troque o trecho em `initContactForm()`. O destinatário está em `CONTACT_EMAIL`.

## Antes de publicar

- Confirmar preço, parcelamento, frete, prazo de troca e "suporte vitalício" com o responsável.
- Trocar o e-mail, o Telegram e o endereço, se mudarem.
- Otimizar as imagens de `assets/` (hoje cerca de 500 KB cada) e adicionar o CNPJ no rodapé.
