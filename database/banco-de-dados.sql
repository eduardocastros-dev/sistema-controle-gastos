-- ============================================
-- Banco de Dados - Controle de Gastos Pessoais
-- ============================================

CREATE DATABASE IF NOT EXISTS controle_gastos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE controle_gastos;

-- Tabela de categorias (CORRIGIDO: adicionado campo 'padrao')
CREATE TABLE IF NOT EXISTS categorias (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(50) NOT NULL,
  tipo      ENUM('receita', 'despesa') NOT NULL,
  icone     VARCHAR(10) DEFAULT '📦',
  padrao    BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- RN7: Nome único por tipo
  UNIQUE KEY uk_nome_tipo (nome, tipo)
);

-- Tabela de transações (conforme diagrama UML)
CREATE TABLE IF NOT EXISTS transacoes (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  descricao    VARCHAR(150) NOT NULL,
  valor        DECIMAL(10, 2) NOT NULL,
  tipo         ENUM('receita', 'despesa') NOT NULL,
  categoria_id INT NOT NULL,
  data         DATE NOT NULL,
  observacao   TEXT,
  criado_em    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
);

-- Índices para performance
CREATE INDEX idx_transacoes_tipo  ON transacoes(tipo);
CREATE INDEX idx_transacoes_data  ON transacoes(data);
CREATE INDEX idx_transacoes_cat   ON transacoes(categoria_id);


-- Dados iniciais — categorias padrão (RN8)

-- RECEITAS
INSERT INTO categorias (nome, tipo, icone, padrao) VALUES
  ('Salário',       'receita',  '💼', TRUE),
  ('Freelance',     'receita',  '💻', TRUE),
  ('Investimentos', 'receita',  '📈', TRUE),
  ('Presente',      'receita',  '🎁', TRUE),
  ('Outro',         'receita',  '💰', TRUE);

-- DESPESAS
INSERT INTO categorias (nome, tipo, icone, padrao) VALUES
  ('Alimentação',   'despesa',  '🍽️', TRUE),
  ('Moradia',       'despesa',  '🏠', TRUE),
  ('Transporte',    'despesa',  '🚗', TRUE),
  ('Saúde',         'despesa',  '🏥', TRUE),
  ('Educação',      'despesa',  '📚', TRUE),
  ('Lazer',         'despesa',  '🎮', TRUE),
  ('Vestuário',     'despesa',  '👕', TRUE),
  ('Outro',         'despesa',  '📦', TRUE);
  
  
  
-- ========================
-- TESTE DO BANCO DE DADOS
-- ========================

describe categorias;
  
select * from categorias;
  
INSERT INTO transacoes(descricao, valor, tipo, categoria_id, data, observacao)
VALUES ('Almoço no restaurante', 35.00, 'despesa', 6, '2026-05-13', 'Com cliente');

SELECT t.*, c.nome AS categoria_nome, c.icone
FROM transacoes t
JOIN categorias c ON t.categoria_id = c.id;



INSERT INTO transacoes (descricao, valor, tipo, categoria_id, `data`, observacao) VALUES
('Café da manhã', 8.50, 'despesa', 6, '2026-05-12', NULL),
('Supermercado', 150.00, 'despesa', 6, '2026-05-10', 'Compras do mês'),
('Uber para trabalho', 25.00, 'despesa', 8, '2026-05-13', NULL),
('Salário maio', 3000.00, 'receita', 1, '2026-05-01', 'Pagamento'),
('Freelance', 500.00, 'receita', 2, '2026-05-05', 'Projeto X');


SELECT 
    SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) AS total_receitas,
    SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) AS total_despesas,
    SUM(CASE WHEN tipo = 'receita' THEN valor ELSE -valor END) AS saldo
FROM transacoes;

SELECT 
    c.nome AS categoria,
    c.tipo,
    c.icone,
    COUNT(t.id) AS quantidade,
    SUM(t.valor) AS total
FROM categorias c
LEFT JOIN transacoes t ON c.id = t.categoria_id
GROUP BY c.id, c.nome, c.tipo, c.icone
HAVING quantidade > 0
ORDER BY total DESC;


SELECT 
    t.*,
    c.nome AS categoria_nome,
    c.icone
FROM transacoes t
JOIN categorias c ON t.categoria_id = c.id
WHERE MONTH(t.data) = 5 AND YEAR(t.data) = 2026
ORDER BY t.data DESC;

SELECT 
    c.nome AS categoria,
    c.tipo,
    GROUP_CONCAT(t.descricao SEPARATOR ' | ') AS transacoes
FROM categorias c
LEFT JOIN transacoes t ON c.id = t.categoria_id
WHERE c.id IN (1, 2, 6, 8)
GROUP BY c.id
ORDER BY c.nome;


-- Ver banco atual
SELECT DATABASE() AS banco_atual;

-- Ver tabelas
SHOW TABLES;

-- Ver estrutura de cada tabela
DESCRIBE categorias;
DESCRIBE transacoes;

-- Ver quantidade de dados
SELECT 
    'categorias' AS tabela,
    COUNT(*) AS total
FROM categorias
UNION ALL
SELECT 
    'transacoes' AS tabela,
    COUNT(*) AS total
FROM transacoes;


-- TESTE QUE VEIO DO FRONTEND
SELECT * FROM transacoes 
ORDER BY id DESC 
LIMIT 1;