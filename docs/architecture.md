# Arquitetura - Ótica ShowRoom Store

Este documento descreve a arquitetura inicial da loja virtual Ótica ShowRoom.

O objetivo do projeto é construir uma loja virtual profissional, com frontend separado do backend, banco de dados PostgreSQL no Supabase, deploy do frontend na Vercel e deploy do backend na Render.

---

# Visão geral

A aplicação será dividida em três partes principais:

1. Frontend
2. Backend
3. Banco de dados

Fluxo principal:

Cliente acessa o frontend
↓
Frontend chama a API
↓
Backend valida regras de negócio
↓
Backend consulta ou altera dados no PostgreSQL
↓
API retorna os dados para o frontend

---

# Stack principal

## Frontend

- React
- Vite
- TypeScript futuramente, se necessário
- React Router
- Deploy na Vercel

Responsabilidades do frontend:

- Exibir vitrine da loja
- Exibir detalhes de produto
- Gerenciar carrinho local
- Enviar pedidos para a API
- Consumir rotas públicas da API
- Futuramente consumir rotas protegidas do admin

---

## Backend

- Node.js
- Fastify
- TypeScript
- Prisma ORM
- Zod
- Pino / Pino Pretty
- Deploy na Render

Responsabilidades do backend:

- Expor API REST
- Validar dados recebidos
- Executar regras de negócio
- Consultar e alterar o banco
- Controlar produtos
- Futuramente controlar pedidos, clientes e autenticação admin

---

## Banco de dados

- PostgreSQL
- Supabase
- Prisma Migrate para versionamento estrutural

Responsabilidades do banco:

- Armazenar produtos
- Armazenar categorias futuramente
- Armazenar clientes futuramente
- Armazenar pedidos futuramente
- Armazenar usuários admin futuramente

---

# Deploy planejado

## Frontend

Plataforma:

Vercel

URL futura esperada:

https://otica-showroom.vercel.app

## Backend

Plataforma:

Render

URL futura esperada:

https://otica-showroom-api.onrender.com

## Banco

Plataforma:

Supabase

Banco:

PostgreSQL

---

# Comunicação entre camadas

## Frontend para Backend

O frontend chamará a API usando HTTP.

Exemplo:

GET https://otica-showroom-api.onrender.com/products

Em desenvolvimento local:

GET http://localhost:3333/products

---

# Estrutura atual do backend

backend/
  prisma/
    migrations/
    schema.prisma
    seed/
      seed.ts

  src/
    app.ts
    server.ts

    config/
      env.ts

    errors/
      app-error.ts
      error-handler.ts

    generated/
      prisma/

    lib/
      prisma.ts

    modules/
      products/
        products.admin.routes.ts
        products.public.routes.ts
        products.routes.ts
        products.controller.ts
        products.service.ts
        products.schemas.ts
        products.mapper.ts

    routes/
      health.routes.ts

  prisma.config.ts
  tsconfig.json
  package.json

---

# Responsabilidade dos arquivos principais

## src/server.ts

Responsável por iniciar o servidor HTTP.

Contém:

- porta
- host
- app.listen
- tratamento de erro de inicialização

## src/app.ts

Responsável por configurar a aplicação Fastify.

Contém:

- logger
- error handler global
- registro de rotas
- plugins futuros

## src/config/env.ts

Centraliza variáveis de ambiente.

Exemplos:

- NODE_ENV
- PORT
- LOG_LEVEL
- DATABASE_URL

## src/lib/prisma.ts

Centraliza a conexão com o Prisma Client e PostgreSQL.

Usa:

- PrismaClient
- PrismaPg
- pg Pool
- DATABASE_URL

## src/errors/app-error.ts

Define erro controlado da aplicação.

Exemplo:

throw new AppError("Produto não encontrado.", 404, "Not found")

## src/errors/error-handler.ts

Handler global de erros da API.

Responsável por tratar:

- ZodError
- AppError
- erros de duplicidade do Prisma
- erros de registro não encontrado do Prisma
- erro interno genérico

---

# Módulo de produtos

O módulo de produtos é o primeiro módulo real da aplicação.

Ele está dividido em:

## products.public.routes.ts

Rotas públicas da vitrine.

Exemplos:

GET /products
GET /products/:slug

## products.admin.routes.ts

Rotas administrativas.

Exemplos:

GET /admin/products
POST /admin/products
PUT /admin/products/:id
DELETE /admin/products/:id

## products.routes.ts

Agregador das rotas de produtos.

Registra:

- rotas públicas
- rotas administrativas

## products.controller.ts

Recebe requisições HTTP e chama os services.

Não deve conter regra pesada de banco.

## products.service.ts

Contém a comunicação com o Prisma e operações do domínio.

Exemplos:

- listProducts
- listAdminProducts
- findProductBySlug
- createProduct
- updateProduct
- deactivateProduct

## products.schemas.ts

Contém validações com Zod.

Exemplos:

- createProductBodySchema
- updateProductBodySchema
- productIdParamsSchema
- getProductBySlugParamsSchema

## products.mapper.ts

Transforma dados internos do Prisma para resposta HTTP.

Exemplo:

- Decimal para string com duas casas
- Date para ISO string

---

# Banco de dados atual

Modelo atual:

Product

Campos principais:

- id
- name
- slug
- description
- price
- salePrice
- sku
- brand
- stock
- active
- featured
- createdAt
- updatedAt

---

# Rotas atuais

## Públicas

GET /health
GET /products
GET /products/:slug

## Administrativas

GET /admin/products
POST /admin/products
PUT /admin/products/:id
DELETE /admin/products/:id

---

# Segurança

Estado atual:

As rotas administrativas ainda não possuem autenticação.

Próximas melhorias planejadas:

- AdminUser
- hash de senha com bcrypt ou argon2
- login admin
- JWT ou sessão segura
- middleware para proteger /admin/*
- variáveis de ambiente seguras na Render
- CORS configurado para aceitar apenas o frontend oficial

---

# Docker

Uso planejado:

- ambiente local padronizado
- possível Postgres local para desenvolvimento
- execução do backend em container
- Nginx futuro para proxy local/prod avançado

No momento, o banco principal está no Supabase.

---

# Nginx

Uso planejado:

- proxy reverso
- ambiente de produção próprio, se necessário
- SSL/TLS em infraestrutura própria
- roteamento entre frontend e backend em cenários futuros

Na arquitetura atual com Vercel e Render, o Nginx não é obrigatório em produção, mas será mantido como conhecimento e estrutura profissional.

---

# GitHub Actions

Uso planejado:

- validar build do backend
- validar TypeScript
- rodar prisma validate
- rodar testes futuros
- bloquear deploy quebrado

Workflows futuros:

.github/workflows/backend-ci.yml
.github/workflows/frontend-ci.yml

---

# Próximos módulos planejados

## Categorias

- Category
- vínculo Product -> Category

## Imagens de produtos

- ProductImage
- múltiplas imagens por produto
- ordem das imagens
- texto alternativo

## Carrinho

Inicialmente pode ficar no frontend.

Depois poderá ser persistido no backend.

## Pedidos

- Customer
- Order
- OrderItem
- status do pedido
- total do pedido
- dados de contato
- endereço

## Autenticação Admin

- AdminUser
- Login
- Middleware de proteção
- Token seguro

---

# Princípios do projeto

- Separação clara de responsabilidades
- Código didático e profissional
- Validação antes de gravar no banco
- Erros padronizados
- Logs legíveis em desenvolvimento
- Logs JSON em produção
- Migrations versionadas
- Soft delete para evitar perda de dados
- Evolução passo a passo
