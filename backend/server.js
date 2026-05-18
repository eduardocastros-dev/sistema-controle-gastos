const express    = require('express');
const cors       = require('cors');
const path       = require('path');
require('dotenv').config();

const { testarConexao } = require('./db');
const rotasCategorias   = require('./routes/categorias');
const rotasTransacoes   = require('./routes/transacoes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares ───────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve o frontend estático
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ─── Rotas da API ──────────────────────────────────────────
app.use('/api/categorias',  rotasCategorias);
app.use('/api/transacoes',  rotasTransacoes);

// Rota raiz — retorna o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Tratamento de erros globais
app.use((err, req, res, next) => {
  console.error('Erro interno:', err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

// ─── Inicialização ─────────────────────────────────────────
async function iniciar() {
  await testarConexao();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📦 API disponível em http://localhost:${PORT}/api`);
  });
}

iniciar();
