// O ESP32 chama esta rota quando o botão da campainha é apertado.
const redis = require('./_redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).end();
  if (!process.env.ALERTA_CHAVE || req.headers['x-chave'] !== process.env.ALERTA_CHAVE) {
    return res.status(401).send('nao autorizado');
  }
  const t = Date.now();
  await redis.zadd('avisos', { score: t, member: String(t) });
  await redis.zremrangebyscore('avisos', 0, t - 24 * 60 * 60 * 1000);
  res.status(200).send('ok');
};
