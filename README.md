# Nest Receitas API 🍳

Este é o backend do desafio técnico de uma aplicação de gerenciamento de receitas. A API foi construída utilizando o framework **NestJS**, focando em escalabilidade, testes e documentação automatizada.

---

## 🚀 Decisões Técnicas

### 1. Repositórios Separados (Monorepo vs Polyrepo)
Optei por utilizar **repositórios separados** para o frontend e o backend por diversos motivos estratégicos:
- **Deploy Independente**: O backend pode ser escalado e atualizado sem afetar o frontend (por exemplo, rodando em um VPS Coolify e o frontend na Vercel).
- **Escalabilidade**: Permite que as equipes (ou o desenvolvedor) foquem em stacks diferentes sem conflitos de dependências.
- **Isolamento de Erros**: Falhas no pipeline de build de um não impedem o deploy do outro.

### 2. NestJS & TypeORM
- **NestJS**: Escolhido pela sua arquitetura robusta baseada em módulos, o que facilita a manutenção e a aplicação de padrões como Injeção de Dependências.
- **TypeORM**: Utilizado para abstrair as consultas ao banco de dados MySQL, permitindo o uso de Migrations para um controle de versionamento do esquema do banco.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [NestJS](https://nestjs.com/)
- **Linguagem**: TypeScript
- **Banco de Dados**: MySQL 8
- **ORM**: TypeORM
- **Documentação**: Swagger (OpenAPI)
- **Autenticação**: Passport.js + JWT
- **Upload de Arquivos**: Multer
- **Testes**: Jest (Unitários e E2E)
- **Containerização**: Docker & Docker Compose

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
- Node.js 20+
- **pnpm** (recomendado) ou npm/yarn
- Docker & Docker Compose (para rodar via container)

### 🐳 Via Docker (Recomendado)

O projeto já conta com um `docker-compose.yml` que configura a API e o banco de dados MySQL:

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd nest-receitas-api

# Crie o arquivo .env baseado no exemplo
cp .env.example .env

# Suba os containers
docker-compose up -d
```
A API estará disponível em `http://localhost:3000/api/v1`.

### 💻 Localmente

1. **Instale as dependências:**
   ```bash
   pnpm install
   ```

2. **Configure o banco de Dados:**
   - Certifique-se de ter um MySQL rodando localmente.
   - Ajuste as variáveis no `.env`.

3. **Rode as Migrations:**
   ```bash
   pnpm run migration:run
   ```

4. **Inicie o servidor:**
   ```bash
   pnpm run start:dev
   ```

---

## 📖 Documentação da API (Swagger)

A documentação interativa da API está disponível em:
👉 `http://localhost:3000/api/v1/docs`

Nela você pode testar todos os endpoints, incluindo os que exigem autenticação Bearer Token.

---

## 🧪 Testes

O projeto possui uma suite de testes automatizados com mensagens em Português para facilitar o entendimento:

```bash
# Testes Unitários
pnpm run test

# Testes de Integração (E2E)
pnpm run test:e2e
```

---

## 🧑‍💻 Autor
Desenvolvido por Bruno VN (@brunovn2000).
