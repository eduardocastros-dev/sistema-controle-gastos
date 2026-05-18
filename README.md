# 💰 Controle de Gastos Pessoais

Sistema web para controle de finanças pessoais com persistência de dados em MySQL.

## 🛠 Tecnologias

| Camada     | Tecnologia          |
|------------|---------------------|
| Backend    | Node.js + Express   |
| Banco de dados | MySQL           |
| Frontend   | HTML + CSS + JS     |
| Gráfico    | Chart.js            |

---

## 📁 Estrutura do Projeto

```
controle-gastos/
├── backend/
│   ├── routes/
│   │   ├── transacoes.js   # Rotas CRUD de transações
│   │   └── categorias.js   # Rotas CRUD de categorias
│   ├── db.js               # Conexão com o MySQL (pool)
│   ├── server.js           # Servidor Express
│   ├── .env.example        # Variáveis de ambiente (exemplo)
│   └── package.json
├── database/
│   └── schema.sql          # Script de criação do banco
└── frontend/
    └── index.html          # Interface web (SPA)
```

---

## ▶️ Como rodar o projeto

### 1. Pré-requisitos

- [Node.js](https://nodejs.org) v18 ou superior
- [MySQL](https://www.mysql.com) instalado e rodando

### 2. Configurar o banco de dados

Abra o MySQL e execute o script:

```sql
source /caminho/para/controle-gastos/database/schema.sql
```

Ou usando o terminal:

```bash
mysql -u root -p < database/schema.sql
```

### 3. Configurar variáveis de ambiente

Na pasta `backend/`, copie o arquivo de exemplo:

```bash
cd backend
cp .env.example .env
```

Abra o `.env` e preencha com suas credenciais MySQL:

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=controle_gastos
```

### 4. Instalar dependências e rodar

```bash
cd backend
npm install
npm start
```

O servidor vai iniciar em: **http://localhost:3000**

> Para modo de desenvolvimento com hot-reload: `npm run dev`

---

## 🔌 Endpoints da API

### Transações

| Método | Rota                        | Descrição                         |
|--------|-----------------------------|-----------------------------------|
| GET    | `/api/transacoes`           | Lista todas as transações         |
| GET    | `/api/transacoes/resumo`    | Retorna saldo, receitas, despesas |
| GET    | `/api/transacoes/mensal`    | Dados agrupados por mês (gráfico) |
| GET    | `/api/transacoes/:id`       | Busca uma transação por ID        |
| POST   | `/api/transacoes`           | Cria nova transação               |
| PUT    | `/api/transacoes/:id`       | Atualiza transação                |
| DELETE | `/api/transacoes/:id`       | Remove transação                  |

### Categorias

| Método | Rota                    | Descrição                   |
|--------|-------------------------|-----------------------------|
| GET    | `/api/categorias`       | Lista todas as categorias   |
| GET    | `/api/categorias?tipo=` | Filtra por receita/despesa  |
| POST   | `/api/categorias`       | Cria nova categoria         |
| DELETE | `/api/categorias/:id`   | Remove categoria            |

### Exemplo de requisição POST `/api/transacoes`

```json
{
  "descricao":    "Salário de maio",
  "valor":        3500.00,
  "tipo":         "receita",
  "categoria_id": 1,
  "data":         "2025-05-01",
  "observacao":   "Mês cheio"
}
```

---

## 🧱 Modelo do Banco de Dados

```
categorias
├── id         INT PK AUTO_INCREMENT
├── nome       VARCHAR(50)
├── tipo       ENUM('receita', 'despesa')
├── icone      VARCHAR(10)
└── criado_em  TIMESTAMP

transacoes
├── id           INT PK AUTO_INCREMENT
├── descricao    VARCHAR(150)
├── valor        DECIMAL(10,2)
├── tipo         ENUM('receita', 'despesa')
├── categoria_id INT FK → categorias.id
├── data         DATE
├── observacao   TEXT (nullable)
└── criado_em    TIMESTAMP
```
