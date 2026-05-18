const express = require('express');
const router  = express.Router();
const { pool } = require('../db');

// ============================================
// VALIDAÇÕES AUXILIARES
// ============================================

/**
 * RN4: Validar Data
 * - Não pode ser futura (máximo hoje + 1 dia)
 * - Deve estar em formato válido
 */
function validarData(dataStr) {
  const data = new Date(dataStr + 'T00:00:00');
  if (isNaN(data.getTime())) {
    return { valido: false, erro: 'Data em formato inválido.' };
  }
  
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  amanha.setHours(23, 59, 59, 999);
  
  if (data > amanha) {
    return { valido: false, erro: 'Data não pode ser futura.' };
  }
  
  return { valido: true };
}

/**
 * RN5: Validar Categoria Compatível
 * - Transação de tipo "receita" → apenas categorias de "receita"
 * - Transação de tipo "despesa" → apenas categorias de "despesa"
 */
async function validarCategoriaCompativel(categoria_id, tipoTransacao) {
  try {
    const [rows] = await pool.execute(
      'SELECT tipo FROM categorias WHERE id = ?',
      [categoria_id]
    );
    
    if (!rows.length) {
      return { valido: false, erro: 'Categoria não encontrada.' };
    }
    
    if (rows[0].tipo !== tipoTransacao) {
      return { 
        valido: false, 
        erro: `Categoria incompatível. Use uma categoria de tipo "${tipoTransacao}".` 
      };
    }
    
    return { valido: true };
  } catch (err) {
    return { valido: false, erro: err.message };
  }
}

/**
 * RN11: Arredondar para 2 casas decimais
 */
function arredondarValor(valor) {
  return Math.round(Number(valor) * 100) / 100;
}

// ============================================
// ENDPOINTS
// ============================================

// GET /api/transacoes — lista transações com filtros opcionais
router.get('/', async (req, res) => {
  try {
    const { tipo, mes, ano, categoria_id } = req.query;

    let sql = `
      SELECT t.*, c.nome AS categoria_nome, c.icone AS categoria_icone
      FROM transacoes t
      JOIN categorias c ON t.categoria_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (tipo) { sql += ' AND t.tipo = ?'; params.push(tipo); }
    if (mes)  { sql += ' AND MONTH(t.data) = ?'; params.push(mes); }
    if (ano)  { sql += ' AND YEAR(t.data) = ?'; params.push(ano); }
    if (categoria_id) { sql += ' AND t.categoria_id = ?'; params.push(categoria_id); }

    sql += ' ORDER BY t.data DESC, t.criado_em DESC';

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET /api/transacoes/resumo — saldo, total receitas e despesas
router.get('/resumo', async (req, res) => {
  try {
    const { mes, ano } = req.query;
    let where = 'WHERE 1=1';
    const params = [];

    if (mes) { where += ' AND MONTH(data) = ?'; params.push(mes); }
    if (ano) { where += ' AND YEAR(data) = ?'; params.push(ano); }

    const [rows] = await pool.execute(`
      SELECT
        SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) AS total_receitas,
        SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) AS total_despesas,
        SUM(CASE WHEN tipo = 'receita' THEN valor ELSE -valor END) AS saldo
      FROM transacoes ${where}
    `, params);

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET /api/transacoes/mensal — dados agregados por mês (para gráfico)
router.get('/mensal', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        YEAR(data)  AS ano,
        MONTH(data) AS mes,
        SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) AS receitas,
        SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) AS despesas
      FROM transacoes
      GROUP BY YEAR(data), MONTH(data)
      ORDER BY ano DESC, mes DESC
      LIMIT 6
    `);
    res.json(rows.reverse());
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET /api/transacoes/:id — busca uma transação
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT t.*, c.nome AS categoria_nome
       FROM transacoes t
       JOIN categorias c ON t.categoria_id = c.id
       WHERE t.id = ?`,
      [req.params.id]
    );

    if (!rows.length) return res.status(404).json({ erro: 'Transação não encontrada.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST /api/transacoes — cria nova transação (RN1-RN11)
router.post('/', async (req, res) => {
  try {
    const { descricao, valor, tipo, categoria_id, data, observacao } = req.body;

    // ✅ RN1: Campos obrigatórios
    if (!descricao || !valor || !tipo || !categoria_id || !data) {
      return res.status(400).json({ 
        erro: 'Campos obrigatórios: descricao, valor, tipo, categoria_id, data.' 
      });
    }

    // ✅ RN3: Tipo válido
    if (!['receita', 'despesa'].includes(tipo)) {
      return res.status(400).json({ 
        erro: 'Tipo deve ser "receita" ou "despesa".' 
      });
    }

    // ✅ RN2: Valor positivo
    if (isNaN(valor) || Number(valor) <= 0) {
      return res.status(400).json({ 
        erro: 'Valor deve ser um número positivo.' 
      });
    }

    // ✅ RN4: Data válida (NOVO!)
    const validacaoData = validarData(data);
    if (!validacaoData.valido) {
      return res.status(400).json({ erro: validacaoData.erro });
    }

    // ✅ RN5: Categoria compatível (NOVO!)
    const validacaoCategoria = await validarCategoriaCompativel(categoria_id, tipo);
    if (!validacaoCategoria.valido) {
      return res.status(400).json({ erro: validacaoCategoria.erro });
    }

    // ✅ RN11: Arredondar valor para 2 casas decimais
    const valorArredondado = arredondarValor(valor);

    const [result] = await pool.execute(
      'INSERT INTO transacoes (descricao, valor, tipo, categoria_id, data, observacao) VALUES (?, ?, ?, ?, ?, ?)',
      [descricao, valorArredondado, tipo, categoria_id, data, observacao || null]
    );

    const [nova] = await pool.execute(
      `SELECT t.*, c.nome AS categoria_nome, c.icone AS categoria_icone
       FROM transacoes t JOIN categorias c ON t.categoria_id = c.id
       WHERE t.id = ?`,
      [result.insertId]
    );

    res.status(201).json(nova[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT /api/transacoes/:id — atualiza transação (RN1-RN11)
router.put('/:id', async (req, res) => {
  try {
    const { descricao, valor, tipo, categoria_id, data, observacao } = req.body;
    const { id } = req.params;

    // Verifica se transação existe
    const [existe] = await pool.execute('SELECT id FROM transacoes WHERE id = ?', [id]);
    if (!existe.length) return res.status(404).json({ erro: 'Transação não encontrada.' });

    // ✅ RN1: Campos obrigatórios
    if (!descricao || !valor || !tipo || !categoria_id || !data) {
      return res.status(400).json({ 
        erro: 'Campos obrigatórios: descricao, valor, tipo, categoria_id, data.' 
      });
    }

    // ✅ RN3: Tipo válido
    if (!['receita', 'despesa'].includes(tipo)) {
      return res.status(400).json({ 
        erro: 'Tipo deve ser "receita" ou "despesa".' 
      });
    }

    // ✅ RN2: Valor positivo
    if (isNaN(valor) || Number(valor) <= 0) {
      return res.status(400).json({ 
        erro: 'Valor deve ser um número positivo.' 
      });
    }

    // ✅ RN4: Data válida (NOVO!)
    const validacaoData = validarData(data);
    if (!validacaoData.valido) {
      return res.status(400).json({ erro: validacaoData.erro });
    }

    // ✅ RN5: Categoria compatível (NOVO!)
    const validacaoCategoria = await validarCategoriaCompativel(categoria_id, tipo);
    if (!validacaoCategoria.valido) {
      return res.status(400).json({ erro: validacaoCategoria.erro });
    }

    // ✅ RN11: Arredondar valor para 2 casas decimais
    const valorArredondado = arredondarValor(valor);

    await pool.execute(
      `UPDATE transacoes
       SET descricao = ?, valor = ?, tipo = ?, categoria_id = ?, data = ?, observacao = ?
       WHERE id = ?`,
      [descricao, valorArredondado, tipo, categoria_id, data, observacao || null, id]
    );

    const [atualizada] = await pool.execute(
      `SELECT t.*, c.nome AS categoria_nome, c.icone AS categoria_icone
       FROM transacoes t JOIN categorias c ON t.categoria_id = c.id WHERE t.id = ?`,
      [id]
    );

    res.json(atualizada[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE /api/transacoes/:id — remove transação
router.delete('/:id', async (req, res) => {
  try {
    const [existe] = await pool.execute('SELECT id FROM transacoes WHERE id = ?', [req.params.id]);
    if (!existe.length) return res.status(404).json({ erro: 'Transação não encontrada.' });

    await pool.execute('DELETE FROM transacoes WHERE id = ?', [req.params.id]);
    res.json({ mensagem: 'Transação removida com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
