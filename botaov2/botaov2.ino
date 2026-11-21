#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

const char* ssid     = "FernandoMeira";
const char* password = "fgpo12345";
String BOTtoken = "8777204341:AAGfbYoQptTgv4q9gP49CDCGpOgQBfgNa3w";
String chat_id  = "5991796905";

// ⚠️ Coloque aqui o IP que apareceu no Serial do RECEPTOR
String ipReceptor = "172.20.10.6";

// Site na Vercel e chave (a mesma da variável ALERTA_CHAVE na Vercel)
String urlSite  = "https://SEU-SITE.vercel.app";
String chaveSite = "TROQUE-ESTA-CHAVE";

#define BOTAO 4
bool estadoAnterior = HIGH;

void setup() {
  Serial.begin(115200);
  pinMode(BOTAO, INPUT_PULLUP);

  WiFi.begin(ssid, password);
  Serial.print("Conectando WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado! IP: " + WiFi.localIP().toString());
}

void enviarTelegram() {
  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;

  String mensagem =
    "🚨 SISTEMA RESIDENCIAL 🚨\n"
    "━━━━━━━━━━━━━━━━━━\n"
    "🔔 Campainha acionada\n"
    "🏠 Alguem esta na porta\n"
    "━━━━━━━━━━━━━━━━━━";

  mensagem.replace(" ", "%20");
  mensagem.replace("\n", "%0A");

  String url = "https://api.telegram.org/bot" + BOTtoken +
               "/sendMessage?chat_id=" + chat_id +
               "&text=" + mensagem;

  http.begin(client, url);
  int httpCode = http.GET();
  Serial.print("Telegram HTTP Code: ");
  Serial.println(httpCode);
  http.end();
}

void enviarAlertaReceptor() {
  HTTPClient http;
  String url = "http://" + ipReceptor + "/alerta";
  http.begin(url);
  int httpCode = http.GET();
  Serial.print("Receptor HTTP Code: ");
  Serial.println(httpCode);
  http.end();
}

void enviarAlertaSite() {
  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  http.begin(client, urlSite + "/api/alerta");
  http.addHeader("x-chave", chaveSite);
  int httpCode = http.POST("");
  Serial.print("Site HTTP Code: ");
  Serial.println(httpCode);
  http.end();
}

void loop() {
  bool estadoBotao = digitalRead(BOTAO);

  if (estadoAnterior == HIGH && estadoBotao == LOW) {
    Serial.println("Botão pressionado!");
    enviarTelegram();
    enviarAlertaReceptor();
    enviarAlertaSite();
    delay(500);
  }

  estadoAnterior = estadoBotao;
}