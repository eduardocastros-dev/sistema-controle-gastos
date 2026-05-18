const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'controle_gastos',
  waitForConnections: true,
  connectionLimit:    10,
});

async function testarConexao() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Banco de dados conectado com sucesso!');
    conn.release();
  } catch (err) {
    console.error('❌ Erro ao conectar no banco:', err.message);
    process.exit(1);
  }
}

module.exports = { pool, testarConexao };
