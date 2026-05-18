# 💰 Sistema de Controle de Gastos Pessoais

Sistema web completo para gerenciamento financeiro pessoal, permitindo controle de receitas e despesas com categorização, filtros e cálculo automático de saldo.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Banco de Dados](#-banco-de-dados)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Como Usar](#-como-usar)
- [Endpoints da API](#-endpoints-da-api)
- [Validações de Negócio](#-validações-de-negócio)
- [Autor](#-autor)

---

## 🎯 Sobre o Projeto

O **Sistema de Controle de Gastos Pessoais** é uma aplicação web desenvolvida para auxiliar usuários no controle de suas finanças pessoais. O sistema permite o cadastro de receitas e despesas organizadas por categorias, além de fornecer relatórios e visualizações que facilitam o acompanhamento do fluxo financeiro.

### Como Funciona

O sistema opera em uma arquitetura cliente-servidor:

1. **Frontend**: Interface web responsiva onde o usuário interage com o sistema
2. **Backend**: API RESTful desenvolvida em Node.js que processa as requisições
3. **Banco de Dados**: MySQL armazena todas as transações e categorias de forma persistente

O usuário pode registrar transações (receitas ou despesas), associá-las a categorias pré-definidas ou personalizadas, e visualizar relatórios que incluem o saldo atual, totais de receitas e despesas, além de gráficos de distribuição por categoria e evolução temporal.

---

## ✨ Funcionalidades

### Gestão de Transações
- ✅ **Cadastro de Transações**: Registre receitas e despesas com descrição, valor, data e categoria
- ✅ **Listagem com Filtros**: Visualize transações filtradas por tipo, categoria, mês ou ano
- ✅ **Edição de Transações**: Atualize informações de transações existentes
- ✅ **Exclusão de Transações**: Remova transações do histórico
- ✅ **Busca Individual**: Consulte detalhes de uma transação específica

### Gestão de Categorias
- ✅ **Categorias Padrão**: Sistema inclui 13 categorias pré-definidas (8 despesas + 5 receitas)
- ✅ **Categorias Personalizadas**: Crie categorias customizadas conforme necessidade
- ✅ **Ícones Emoji**: Cada categoria possui um emoji para identificação visual
- ✅ **Proteção de Dados**: Não permite exclusão de categorias com transações associadas

### Relatórios e Análises
- ✅ **Cálculo de Saldo**: Saldo automático = Total de Receitas - Total de Despesas
- ✅ **Totalizadores**: Visualize totais de receitas e despesas separadamente
- ✅ **Dados Mensais**: Relatórios agregados por mês para análise de evolução
- ✅ **Relacionamento de Dados**: Transações exibem automaticamente nome e ícone da categoria

### Validações e Segurança
- ✅ **Validação de Campos**: Campos obrigatórios e formatos validados
- ✅ **Regras de Negócio**: 7 regras de negócio implementadas (RN1-RN7)
- ✅ **Integridade Referencial**: Chaves estrangeiras garantem consistência dos dados
- ✅ **Prevenção de Duplicatas**: UNIQUE KEY impede categorias duplicadas

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** (v14+): Ambiente de execução JavaScript
- **Express.js** (v4.x): Framework web para APIs RESTful
- **MySQL2** (v3.x): Driver MySQL com suporte a Promises
- **dotenv** (v16.x): Gerenciamento de variáveis de ambiente
- **CORS**: Middleware para controle de requisições cross-origin

### Banco de Dados
- **MySQL** (v8.0+): Sistema de gerenciamento de banco de dados relacional
- **MySQL Workbench**: Ferramenta de administração e modelagem

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilização e responsividade
- **JavaScript (ES6+)**: Lógica de interação e requisições à API
- **Fetch API**: Comunicação assíncrona com o backend

### Ferramentas de Desenvolvimento
- **Git**: Controle de versão
- **VS Code**: Editor de código
- **Postman**: Testes de API
- **npm**: Gerenciador de pacotes

---

## 📁 Estrutura do Projeto

```
sistema-controle-gastos/
│
├── backend/                          # Servidor e API REST
│   ├── routes/                       # Rotas da API
│   │   ├── categorias.js            # Endpoints de categorias
│   │   └── transacoes.js            # Endpoints de transações
│   │
│   ├── db.js                        # Configuração do pool MySQL
│   ├── server.js                    # Servidor Express principal
│   ├── .env                         # Variáveis de ambiente (não versionado)
│   ├── .env.example                 # Modelo de configuração
│   ├── package.json                 # Dependências do projeto
│   └── package-lock.json            # Lock de versões
│
├── frontend/                         # Interface do usuário
│   ├── index.html                   # Página principal
│   ├── styles.css                   # Estilos
│   └── script.js                    # Lógica frontend
│
├── database/                         # Scripts de banco de dados
│   └── schema.sql                   # Schema completo (DDL + DML)
│
├── .gitignore                       # Arquivos ignorados pelo Git
└── README.md                        # Este arquivo
```

### Descrição dos Principais Arquivos

**Backend:**
- `server.js`: Inicializa o servidor Express, configura middlewares (CORS, JSON parser) e registra as rotas
- `db.js`: Cria e exporta o pool de conexões MySQL usando mysql2/promise
- `routes/categorias.js`: Define 5 endpoints para gestão de categorias (CRUD completo)
- `routes/transacoes.js`: Define 6 endpoints para gestão de transações (CRUD + relatórios)

**Banco de Dados:**
- `schema.sql`: Contém CREATE DATABASE, CREATE TABLE, INSERT de dados padrão e relacionamentos

**Configuração:**
- `.env`: Armazena credenciais e configurações sensíveis (DB_HOST, DB_PASSWORD, etc.)
- `.env.example`: Modelo para outros desenvolvedores saberem quais variáveis configurar

---

## 🗄️ Banco de Dados

### Arquitetura do Banco

O sistema utiliza o banco de dados **MySQL** com arquitetura relacional normalizada (3FN).

**Nome do Banco:** `controle_gastos`  
**Charset:** UTF8MB4 (suporte completo a emojis e caracteres especiais)  
**Collation:** utf8mb4_unicode_ci

### Tabelas

#### 1. Tabela: `categorias`

Armazena as categorias de receitas e despesas.

| Campo       | Tipo          | Descrição                                    |
|-------------|---------------|----------------------------------------------|
| `id`        | INT (PK)      | Identificador único (AUTO_INCREMENT)         |
| `nome`      | VARCHAR(100)  | Nome da categoria                            |
| `tipo`      | ENUM          | 'receita' ou 'despesa'                       |
| `icone`     | VARCHAR(10)   | Emoji representativo                         |
| `padrao`    | TINYINT(1)    | 1 = padrão do sistema, 0 = personalizada     |
| `criado_em` | TIMESTAMP     | Data/hora de criação (DEFAULT CURRENT_TIMESTAMP) |

**Constraints:**
- PRIMARY KEY: `id`
- UNIQUE KEY: (`nome`, `tipo`) - Impede categorias duplicadas
- CHECK: `tipo IN ('receita', 'despesa')`

**Dados Padrão:** 13 categorias (5 receitas + 8 despesas)

**Categorias de Receita:**
- 💼 Salário
- 💻 Freelance
- 📈 Investimentos
- 🎁 Presente
- 💵 Outro

**Categorias de Despesa:**
- 🍽️ Alimentação
- 🚗 Transporte
- 🏠 Moradia
- 💡 Contas
- 🎓 Educação
- 🏥 Saúde
- 🎮 Lazer
- 🛒 Compras

---

#### 2. Tabela: `transacoes`

Registra todas as transações financeiras.

| Campo          | Tipo          | Descrição                                    |
|----------------|---------------|----------------------------------------------|
| `id`           | INT (PK)      | Identificador único (AUTO_INCREMENT)         |
| `descricao`    | VARCHAR(255)  | Descrição da transação                       |
| `valor`        | DECIMAL(10,2) | Valor (positivo)                             |
| `tipo`         | ENUM          | 'receita' ou 'despesa'                       |
| `categoria_id` | INT (FK)      | Referência à tabela categorias               |
| `data`         | DATE          | Data da transação                            |
| `observacao`   | TEXT          | Observações adicionais (opcional)            |
| `criado_em`    | TIMESTAMP     | Data/hora de criação                         |

**Constraints:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `categoria_id` REFERENCES `categorias(id)` ON DELETE RESTRICT
- CHECK: `valor > 0`
- CHECK: `tipo IN ('receita', 'despesa')`

**Índices:**
- INDEX: `categoria_id` (otimiza JOIN)
- INDEX: `data` (otimiza filtros por data)
- INDEX: `tipo` (otimiza filtros por tipo)

---

### Relacionamentos

```
categorias (1) ─────< (N) transacoes
     │                       │
     └─ id ───────────────── categoria_id
```

**Cardinalidade:** 1:N (One-to-Many)
- Uma categoria pode ter várias transações
- Uma transação pertence a apenas uma categoria
- **ON DELETE RESTRICT**: Não permite deletar categoria com transações associadas

---

### Diagrama Entidade-Relacionamento (ER)

```
┌─────────────────────┐
│    CATEGORIAS       │
├─────────────────────┤
│ PK id               │
│    nome             │
│    tipo             │
│    icone            │
│    padrao           │
│    criado_em        │
└─────────────────────┘
          │
          │ 1
          │
          │ N
          ▼
┌─────────────────────┐
│    TRANSACOES       │
├─────────────────────┤
│ PK id               │
│    descricao        │
│    valor            │
│    tipo             │
│ FK categoria_id     │◄───┐
│    data             │    │
│    observacao       │    │
│    criado_em        │    │
└─────────────────────┘    │
                           │
                    Relacionamento 1:N
```

---

## ⚙️ Instalação e Configuração

### Pré-requisitos

- **Node.js** 14.0 ou superior ([Download](https://nodejs.org/))
- **MySQL** 8.0 ou superior ([Download](https://dev.mysql.com/downloads/))
- **Git** ([Download](https://git-scm.com/))

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/sistema-controle-gastos.git
cd sistema-controle-gastos
```

### Passo 2: Configurar o Banco de Dados

**1. Criar o banco de dados no MySQL:**

```bash
mysql -u root -p
```

**2. Executar o script SQL:**

```sql
SOURCE /caminho/para/database/schema.sql;
```

**Ou usando MySQL Workbench:**
- Abrir o arquivo `database/schema.sql`
- Executar o script (⚡ Execute)

**Verificar criação:**

```sql
USE controle_gastos;
SHOW TABLES;
SELECT COUNT(*) FROM categorias;  -- Deve retornar 13
```

### Passo 3: Configurar Variáveis de Ambiente

**1. Navegar para a pasta backend:**

```bash
cd backend
```

**2. Copiar o arquivo de exemplo:**

```bash
cp .env.example .env
```

**3. Editar o arquivo `.env` com suas credenciais:**

```env
# Configurações do Servidor
PORT=3000

# Configurações do Banco de Dados MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=controle_gastos
```

⚠️ **IMPORTANTE:** Nunca compartilhe o arquivo `.env` ou faça commit dele no Git!

### Passo 4: Instalar Dependências

```bash
npm install
```

### Passo 5: Iniciar o Servidor

```bash
node server.js
```

**Saída esperada:**

```
Servidor rodando na porta 3000
✅ Banco de dados conectado com sucesso!
API disponível em http://localhost:3000/api
```

### Passo 6: Acessar a Aplicação

**Frontend:**
- Abrir `frontend/index.html` no navegador

**Backend (API):**
- Testar endpoints: `http://localhost:3000/api/categorias`

---

## 📖 Como Usar

### Interface Web

1. **Cadastrar Transação:**
   - Preencher formulário com descrição, valor, tipo, categoria e data
   - Clicar em "Adicionar Transação"

2. **Visualizar Transações:**
   - A lista é atualizada automaticamente
   - Use os filtros para buscar transações específicas

3. **Editar Transação:**
   - Clicar no botão "Editar" ao lado da transação
   - Modificar os dados desejados
   - Salvar alterações

4. **Deletar Transação:**
   - Clicar no botão "Excluir"
   - Confirmar a exclusão

5. **Visualizar Saldo:**
   - O saldo é calculado automaticamente
   - Exibido no topo da página

---

## 🔌 Endpoints da API

### Base URL
```
http://localhost:3000/api
```

---

### Categorias

#### 1. Listar Todas as Categorias
```http
GET /api/categorias
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Salário",
    "tipo": "receita",
    "icone": "💼",
    "padrao": 1,
    "criado_em": "2026-05-13T13:00:00.000Z"
  },
  ...
]
```

#### 2. Buscar Categoria por ID
```http
GET /api/categorias/:id
```

**Exemplo:** `GET /api/categorias/1`

**Resposta (200 OK):**
```json
{
  "id": 1,
  "nome": "Salário",
  "tipo": "receita",
  "icone": "💼",
  "padrao": 1,
  "criado_em": "2026-05-13T13:00:00.000Z"
}
```

#### 3. Criar Nova Categoria
```http
POST /api/categorias
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "Academia",
  "tipo": "despesa",
  "icone": "🏋️"
}
```

**Resposta (201 Created):**
```json
{
  "id": 14,
  "nome": "Academia",
  "tipo": "despesa",
  "icone": "🏋️"
}
```

#### 4. Atualizar Categoria
```http
PUT /api/categorias/:id
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "Academia e Esportes",
  "icone": "⚽"
}
```

#### 5. Deletar Categoria
```http
DELETE /api/categorias/:id
```

⚠️ **Nota:** Não é possível deletar categorias com transações associadas (ON DELETE RESTRICT).

---

### Transações

#### 1. Listar Transações (com Filtros Opcionais)
```http
GET /api/transacoes
GET /api/transacoes?tipo=despesa
GET /api/transacoes?categoria_id=6
GET /api/transacoes?mes=5&ano=2026
```

**Parâmetros de Query:**
- `tipo`: 'receita' ou 'despesa'
- `categoria_id`: ID da categoria
- `mes`: Mês (1-12)
- `ano`: Ano (ex: 2026)

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "descricao": "Almoço no restaurante",
    "valor": "35.00",
    "tipo": "despesa",
    "categoria_id": 6,
    "data": "2026-05-13",
    "observacao": "Com cliente",
    "criado_em": "2026-05-13T13:00:00.000Z",
    "categoria_nome": "Alimentação",
    "categoria_icone": "🍽️"
  },
  ...
]
```

#### 2. Buscar Transação por ID
```http
GET /api/transacoes/:id
```

#### 3. Calcular Resumo Financeiro
```http
GET /api/transacoes/resumo
GET /api/transacoes/resumo?mes=5&ano=2026
```

**Resposta (200 OK):**
```json
{
  "total_receitas": "3500.00",
  "total_despesas": "218.50",
  "saldo": "3281.50"
}
```

#### 4. Dados Agregados por Mês
```http
GET /api/transacoes/mensal
```

**Resposta (200 OK):**
```json
[
  {
    "ano": 2026,
    "mes": 5,
    "receitas": "3500.00",
    "despesas": "218.50"
  },
  ...
]
```

#### 5. Criar Nova Transação
```http
POST /api/transacoes
Content-Type: application/json
```

**Body:**
```json
{
  "descricao": "Supermercado",
  "valor": 150.00,
  "tipo": "despesa",
  "categoria_id": 6,
  "data": "2026-05-17",
  "observacao": "Compras do mês"
}
```

**Resposta (201 Created):**
```json
{
  "id": 7,
  "descricao": "Supermercado",
  "valor": 150.00,
  "tipo": "despesa",
  "categoria_id": 6,
  "data": "2026-05-17"
}
```

#### 6. Atualizar Transação
```http
PUT /api/transacoes/:id
Content-Type: application/json
```

**Body:**
```json
{
  "descricao": "Supermercado Atualizado",
  "valor": 175.50
}
```

#### 7. Deletar Transação
```http
DELETE /api/transacoes/:id
```

**Resposta (200 OK):**
```json
{
  "mensagem": "Transação deletada com sucesso."
}
```

---

## ✅ Validações de Negócio

O sistema implementa 7 Regras de Negócio (RN) para garantir a integridade dos dados:

### RN1: Campos Obrigatórios
**Descrição:** Todos os campos marcados como obrigatórios devem ser preenchidos.

**Transações:**
- ✅ descricao (obrigatório)
- ✅ valor (obrigatório)
- ✅ tipo (obrigatório)
- ✅ categoria_id (obrigatório)
- ✅ data (obrigatório)
- ⚪ observacao (opcional)

**Categorias:**
- ✅ nome (obrigatório)
- ✅ tipo (obrigatório)
- ⚪ icone (opcional)

**Erro (400):**
```json
{
  "erro": "Campos obrigatórios: descricao, valor, tipo, categoria_id, data."
}
```

---

### RN2: Valor Positivo
**Descrição:** O valor de uma transação deve ser sempre positivo (maior que zero).

**Validação:**
```javascript
if (valor <= 0) {
  return res.status(400).json({ 
    erro: 'O valor deve ser positivo.' 
  });
}
```

**Também validado no banco:**
```sql
CONSTRAINT chk_valor_positivo CHECK (valor > 0)
```

**Erro (400):**
```json
{
  "erro": "O valor deve ser positivo."
}
```

---

### RN3: Tipo Válido
**Descrição:** O tipo deve ser 'receita' ou 'despesa' (case-insensitive).

**Validação:**
```javascript
if (!['receita', 'despesa'].includes(tipo)) {
  return res.status(400).json({ 
    erro: 'Tipo deve ser "receita" ou "despesa".' 
  });
}
```

**Também validado no banco:**
```sql
tipo ENUM('receita', 'despesa') NOT NULL
```

**Erro (400):**
```json
{
  "erro": "Tipo deve ser 'receita' ou 'despesa'."
}
```

---

### RN4: Data Não Futura
**Descrição:** Não é permitido cadastrar transações com datas futuras.

**Validação:**
```javascript
const hoje = new Date();
hoje.setHours(0, 0, 0, 0);

const dataTransacao = new Date(data);
dataTransacao.setHours(0, 0, 0, 0);

if (dataTransacao > hoje) {
  return res.status(400).json({ 
    erro: 'A data não pode ser futura.' 
  });
}
```

**Erro (400):**
```json
{
  "erro": "A data não pode ser futura."
}
```

---

### RN5: Categoria Compatível com Tipo
**Descrição:** Uma transação de receita só pode usar categorias de receita, e uma despesa só pode usar categorias de despesa.

**Validação:**
```javascript
const [categorias] = await pool.execute(
  'SELECT tipo FROM categorias WHERE id = ?',
  [categoria_id]
);

if (categorias[0].tipo !== tipo) {
  return res.status(400).json({
    erro: 'Tipo de transação incompatível com a categoria.'
  });
}
```

**Exemplo:**
- ❌ Transação tipo "despesa" + Categoria "Salário" (receita) → ERRO
- ✅ Transação tipo "despesa" + Categoria "Alimentação" (despesa) → OK

**Erro (400):**
```json
{
  "erro": "Tipo de transação incompatível com a categoria."
}
```

---

### RN6: Integridade Referencial (Foreign Key)
**Descrição:** Não é possível deletar uma categoria que possui transações associadas.

**Implementação:**
```sql
FOREIGN KEY (categoria_id) 
REFERENCES categorias(id) 
ON DELETE RESTRICT
```

**Comportamento:**
- ✅ Deletar categoria SEM transações → Sucesso
- ❌ Deletar categoria COM transações → Erro MySQL

**Erro (500):**
```json
{
  "erro": "Cannot delete or update a parent row: a foreign key constraint fails"
}
```

---

### RN7: Categoria Única por Tipo
**Descrição:** Não pode existir duas categorias com o mesmo nome e tipo.

**Implementação:**
```sql
UNIQUE KEY uk_nome_tipo (nome, tipo)
```

**Exemplo:**
- ❌ Categoria "Alimentação" (despesa) já existe → ERRO ao criar outra "Alimentação" (despesa)
- ✅ Categoria "Alimentação" (despesa) + "Alimentação" (receita) → OK (tipos diferentes)

**Erro (500):**
```json
{
  "erro": "Duplicate entry 'Alimentação-despesa' for key 'uk_nome_tipo'"
}
```

---

## 🧪 Testando a API

### Usando cURL

**Listar categorias:**
```bash
curl http://localhost:3000/api/categorias
```

**Criar transação:**
```bash
curl -X POST http://localhost:3000/api/transacoes \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Teste",
    "valor": 100,
    "tipo": "receita",
    "categoria_id": 1,
    "data": "2026-05-17"
  }'
```

**Obter saldo:**
```bash
curl http://localhost:3000/api/transacoes/resumo
```

### Usando Postman

1. Importar a coleção (criar arquivo `postman_collection.json`)
2. Configurar variável `base_url = http://localhost:3000/api`
3. Testar endpoints um por um

---

## 📊 Exemplos de Uso

### Cenário 1: Cadastrar Salário do Mês

```javascript
POST /api/transacoes

{
  "descricao": "Salário Maio/2026",
  "valor": 5000.00,
  "tipo": "receita",
  "categoria_id": 1,  // Salário
  "data": "2026-05-05",
  "observacao": "Depósito na conta"
}
```

### Cenário 2: Registrar Compra no Supermercado

```javascript
POST /api/transacoes

{
  "descricao": "Supermercado - Compras do mês",
  "valor": 450.80,
  "tipo": "despesa",
  "categoria_id": 6,  // Alimentação
  "data": "2026-05-10"
}
```

### Cenário 3: Ver Quanto Gastou com Transporte Este Mês

```javascript
GET /api/transacoes?tipo=despesa&categoria_id=7&mes=5&ano=2026

// Retorna todas as transações de transporte de maio/2026
```

### Cenário 4: Calcular Saldo Atual

```javascript
GET /api/transacoes/resumo

// Resposta:
{
  "total_receitas": "5000.00",
  "total_despesas": "1250.30",
  "saldo": "3749.70"
}
```

---

## 🐛 Solução de Problemas

### Erro: "Cannot find module 'express'"

**Solução:**
```bash
cd backend
npm install
```

### Erro: "Access denied for user 'root'@'localhost'"

**Solução:** Verifique as credenciais no arquivo `.env`

```env
DB_USER=root
DB_PASSWORD=sua_senha_correta
```

### Erro: "Unknown database 'controle_gastos'"

**Solução:** Criar o banco de dados:

```sql
CREATE DATABASE controle_gastos;
```

### Erro: "Port 3000 already in use"

**Solução 1:** Mudar a porta no `.env`:

```env
PORT=4000
```

**Solução 2:** Matar o processo na porta 3000:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [número_do_processo] /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

### Servidor não conecta no MySQL

**Verifique:**
1. MySQL está rodando?
2. Credenciais corretas no `.env`?
3. Banco `controle_gastos` foi criado?
4. Porta 3306 está correta?

---

## 🚧 Futuras Melhorias

- [ ] Implementar autenticação de usuários (JWT)
- [ ] Adicionar gráficos de visualização de dados
- [ ] Exportar relatórios em PDF
- [ ] Implementar categorias hierárquicas (subcategorias)
- [ ] Adicionar funcionalidade de metas financeiras
- [ ] Implementar notificações de gastos excessivos
- [ ] Criar aplicativo mobile (React Native)
- [ ] Adicionar dashboard com métricas avançadas
- [ ] Implementar importação de extratos bancários
- [ ] Suporte a múltiplas moedas

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como trabalho acadêmico.

---

## 👤 Autor

**Eduardo Castro**

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- Email: eduardo@email.com

---

## 🙏 Agradecimentos

- Professor orientador
- Comunidade Node.js
- Documentação do MySQL
- Colegas de turma

---

## 📞 Suporte

Se encontrar algum problema ou tiver dúvidas:

1. Verifique a seção [Solução de Problemas](#-solução-de-problemas)
2. Consulte a documentação das tecnologias utilizadas
3. Abra uma issue no GitHub

---

**Desenvolvido com ❤️ por Eduardo Castro**

**Data de Criação:** Maio de 2026  
**Última Atualização:** 17/05/2026