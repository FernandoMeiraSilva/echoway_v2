// O site consulta esta rota para saber se houve toques novos.
const redis = require('./_redis');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const desde = Number(req.query.desde) || 0;
  const lista = await redis.zrange('avisos', desde + 1, '+inf', { byScore: true });
  res.status(200).json({ toques: lista.map(Number) });
};
