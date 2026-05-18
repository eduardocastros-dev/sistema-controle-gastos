const express = require('express');
const router  = express.Router();
const { pool } = require('../db');

// ============================================
// GET /api/categorias — lista todas as categorias
// ============================================

router.get('/', async (req, res) => {
  try {
    const { tipo } = req.query;
    let sql = 'SELECT * FROM categorias ORDER BY tipo, nome';
    const params = [];

    if (tipo) {
      sql = 'SELECT * FROM categorias WHERE tipo = ? ORDER BY nome';
      params.push(tipo);
    }

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ============================================
// POST /api/categorias — cria nova categoria (RN7)
// ============================================

router.post('/', async (req, res) => {
  try {
    const { nome, tipo, icone } = req.body;

    // Campos obrigatórios
    if (!nome || !tipo) {
      return res.status(400).json({ 
        erro: 'Nome e tipo são obrigatórios.' 
      });
    }

    // Tipo válido
    if (!['receita', 'despesa'].includes(tipo)) {
      return res.status(400).json({ 
        erro: 'Tipo deve ser "receita" ou "despesa".' 
      });
    }

    // ✅ RN7: Verificar duplicação - nome único por tipo (NOVO!)
    const [existe] = await pool.execute(
      'SELECT id FROM categorias WHERE nome = ? AND tipo = ?',
      [nome, tipo]
    );

    if (existe.length > 0) {
      return res.status(400).json({ 
        erro: `Já existe uma categoria com nome "${nome}" do tipo "${tipo}".` 
      });
    }

    // Inserir categoria (padrão = FALSE para categorias novas)
    const [result] = await pool.execute(
      'INSERT INTO categorias (nome, tipo, icone, padrao) VALUES (?, ?, ?, FALSE)',
      [nome, tipo, icone || '📦']
    );

    res.status(201).json({ 
      id: result.insertId, 
      nome, 
      tipo, 
      icone: icone || '📦',
      padrao: false
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ============================================
// PUT /api/categorias/:id — renomeia categoria (NOVO!)
// ============================================

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    // Verificar se categoria existe
    const [categoria] = await pool.execute(
      'SELECT * FROM categorias WHERE id = ?',
      [id]
    );

    if (!categoria.length) {
      return res.status(404).json({ 
        erro: 'Categoria não encontrada.' 
      });
    }

    // ✅ RN8: Não permitir renomear categorias padrão (NOVO!)
    if (categoria[0].padrao === 1 || categoria[0].padrao === true) {
      return res.status(400).json({ 
        erro: 'Categorias padrão não podem ser renomeadas.' 
      });
    }

    // Se não forneceu novo nome, retorna erro
    if (!nome) {
      return res.status(400).json({ 
        erro: 'Novo nome é obrigatório.' 
      });
    }

    // ✅ RN7: Verificar se novo nome já existe com o mesmo tipo
    const [nomeExistente] = await pool.execute(
      'SELECT id FROM categorias WHERE nome = ? AND tipo = ? AND id != ?',
      [nome, categoria[0].tipo, id]
    );

    if (nomeExistente.length > 0) {
      return res.status(400).json({ 
        erro: `Já existe outra categoria com nome "${nome}" do tipo "${categoria[0].tipo}".` 
      });
    }

    // Atualizar nome
    await pool.execute(
      'UPDATE categorias SET nome = ? WHERE id = ?',
      [nome, id]
    );

    // Retornar categoria atualizada
    const [atualizada] = await pool.execute(
      'SELECT * FROM categorias WHERE id = ?',
      [id]
    );

    res.json(atualizada[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ============================================
// DELETE /api/categorias/:id — remove categoria (RN6, RN8)
// ============================================

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se categoria existe
    const [categoria] = await pool.execute(
      'SELECT * FROM categorias WHERE id = ?',
      [id]
    );

    if (!categoria.length) {
      return res.status(404).json({ 
        erro: 'Categoria não encontrada.' 
      });
    }

    // ✅ RN8: Não permitir deletar categorias padrão (NOVO!)
    if (categoria[0].padrao === 1 || categoria[0].padrao === true) {
      return res.status(400).json({ 
        erro: 'Categorias padrão não podem ser removidas.' 
      });
    }

    // ✅ RN6: Verificar se categoria está em uso (existente)
    const [uso] = await pool.execute(
      'SELECT COUNT(*) AS total FROM transacoes WHERE categoria_id = ?',
      [id]
    );

    if (uso[0].total > 0) {
      return res.status(400).json({
        erro: `Categoria em uso por ${uso[0].total} transação(ões). Remova as transações antes de deletar a categoria.`
      });
    }

    // Deletar categoria
    await pool.execute('DELETE FROM categorias WHERE id = ?', [id]);
    
    res.json({ mensagem: 'Categoria removida com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
