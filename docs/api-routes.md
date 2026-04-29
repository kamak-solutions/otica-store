# API Routes - Ótica ShowRoom Store

Documentação inicial das rotas da API da loja virtual Ótica ShowRoom.

## Base URL local

http://localhost:3333

---

## Stack atual da API

- Node.js
- Fastify
- TypeScript
- Prisma ORM
- PostgreSQL Supabase
- Zod para validação
- Pino / Pino Pretty para logs
- Handler global de erros

---

# Health Check

## GET /health

Verifica se a API está online.

### Exemplo

GET /health

### Resposta 200

{
  "status": "ok",
  "service": "otica-showroom-api",
  "environment": "development",
  "timestamp": "2026-04-28T21:00:00.000Z"
}

---

# Produtos - Rotas Públicas

As rotas públicas representam a vitrine da loja.

Produtos inativos não aparecem nas rotas públicas.

---

## GET /products

Lista todos os produtos ativos da loja.

### Exemplo

GET /products

### Observações

- Retorna somente produtos com active = true.
- O campo price retorna como string formatada com duas casas decimais.
- Produtos desativados não aparecem aqui.

### Resposta 200

{
  "data": [
    {
      "id": "uuid-do-produto",
      "name": "Óculos Solar Premium",
      "slug": "oculos-solar-premium",
      "description": "Óculos solar elegante para uso diário.",
      "price": "199.90",
      "salePrice": null,
      "sku": null,
      "brand": null,
      "stock": 10,
      "active": true,
      "featured": false,
      "createdAt": "2026-04-28T21:29:06.904Z",
      "updatedAt": "2026-04-28T21:29:06.904Z"
    }
  ]
}

---

## GET /products/:slug

Busca um produto ativo pelo slug.

### Exemplo

GET /products/oculos-solar-premium

### Resposta 200

{
  "data": {
    "id": "uuid-do-produto",
    "name": "Óculos Solar Premium",
    "slug": "oculos-solar-premium",
    "description": "Óculos solar elegante para uso diário.",
    "price": "199.90",
    "salePrice": null,
    "sku": null,
    "brand": null,
    "stock": 10,
    "active": true,
    "featured": false,
    "createdAt": "2026-04-28T21:29:06.904Z",
    "updatedAt": "2026-04-28T21:29:06.904Z"
  }
}

### Resposta 404

{
  "error": "Not found",
  "message": "Produto não encontrado."
}

---

# Produtos - Rotas Administrativas

As rotas administrativas são usadas para gestão interna da loja.

No estado atual do projeto, essas rotas ainda não possuem autenticação.

A autenticação será adicionada em uma etapa futura.

---

## GET /admin/products

Lista todos os produtos cadastrados, incluindo ativos e inativos.

### Exemplo

GET /admin/products

### Observações

- Retorna produtos ativos e inativos.
- Essa rota é para uso do painel administrativo.

---

## POST /admin/products

Cria um novo produto.

### Exemplo

POST /admin/products

Header:

Content-Type: application/json

### Body

{
  "name": "Óculos Solar Feminino Elegance",
  "slug": "oculos-solar-feminino-elegance",
  "description": "Óculos solar feminino com design elegante.",
  "price": 189.90,
  "salePrice": 159.90,
  "sku": "OSF-ELEGANCE-001",
  "brand": "Ótica ShowRoom",
  "stock": 15,
  "active": true,
  "featured": true
}

### Resposta 201

{
  "data": {
    "id": "uuid-do-produto",
    "name": "Óculos Solar Feminino Elegance",
    "slug": "oculos-solar-feminino-elegance",
    "description": "Óculos solar feminino com design elegante.",
    "price": "189.90",
    "salePrice": "159.90",
    "sku": "OSF-ELEGANCE-001",
    "brand": "Ótica ShowRoom",
    "stock": 15,
    "active": true,
    "featured": true,
    "createdAt": "2026-04-28T21:29:06.904Z",
    "updatedAt": "2026-04-28T21:29:06.904Z"
  }
}

### Resposta 400

{
  "error": "Validation error",
  "message": "Dados inválidos.",
  "issues": []
}

### Resposta 409

{
  "error": "Conflict",
  "message": "Já existe um registro com dados únicos informados."
}

---

## PUT /admin/products/:id

Atualiza parcialmente um produto existente.

### Exemplo

PUT /admin/products/uuid-do-produto

Header:

Content-Type: application/json

### Body

{
  "price": 249.90,
  "stock": 12,
  "featured": true
}

### Resposta 200

{
  "data": {
    "id": "uuid-do-produto",
    "name": "Óculos Solar Premium",
    "slug": "oculos-solar-premium",
    "description": "Óculos solar elegante para uso diário.",
    "price": "249.90",
    "salePrice": null,
    "sku": null,
    "brand": null,
    "stock": 12,
    "active": true,
    "featured": true,
    "createdAt": "2026-04-28T21:29:06.904Z",
    "updatedAt": "2026-04-28T21:40:00.000Z"
  }
}

---

## DELETE /admin/products/:id

Desativa um produto.

Essa rota não remove o produto fisicamente do banco.

Ela faz soft delete, alterando:

active = false

### Exemplo

DELETE /admin/products/uuid-do-produto

### Resposta 200

{
  "data": {
    "id": "uuid-do-produto",
    "name": "Óculos Solar Premium",
    "slug": "oculos-solar-premium",
    "description": "Óculos solar elegante para uso diário.",
    "price": "199.90",
    "salePrice": null,
    "sku": null,
    "brand": null,
    "stock": 10,
    "active": false,
    "featured": false,
    "createdAt": "2026-04-28T21:29:06.904Z",
    "updatedAt": "2026-04-28T21:45:00.000Z"
  },
  "message": "Produto desativado com sucesso."
}

---

# Modelo atual de Product

model Product {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?
  price       Decimal  @db.Decimal(10, 2)
  salePrice   Decimal? @db.Decimal(10, 2)
  sku         String?  @unique
  brand       String?
  stock       Int      @default(0)
  active      Boolean  @default(true)
  featured    Boolean  @default(false)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

---

# Padrão de resposta

## Sucesso com dados

{
  "data": {}
}

ou:

{
  "data": []
}

## Sucesso com mensagem

{
  "data": {},
  "message": "Mensagem de sucesso."
}

## Erro

{
  "error": "Tipo do erro",
  "message": "Mensagem amigável."
}

## Erro de validação

{
  "error": "Validation error",
  "message": "Dados inválidos.",
  "issues": []
}

---

# Observações importantes

## Rotas públicas

As rotas públicas devem ser usadas pelo frontend da loja.

GET /products
GET /products/:slug

## Rotas administrativas

As rotas administrativas serão usadas pelo painel admin.

GET /admin/products
POST /admin/products
PUT /admin/products/:id
DELETE /admin/products/:id

## Autenticação

As rotas administrativas ainda não possuem autenticação.

Essa etapa será implementada futuramente com:

- login do admin
- hash de senha
- JWT ou sessão segura
- middleware de autenticação
- proteção das rotas /admin/*

## Soft delete

Produtos não são apagados fisicamente.

A rota DELETE /admin/products/:id apenas altera:

active = false

Isso preserva histórico e evita perda de dados.

---

# Exemplos úteis com curl

## Listar produtos públicos

curl -s http://localhost:3333/products | python -m json.tool

## Buscar produto por slug

curl -s http://localhost:3333/products/oculos-solar-premium | python -m json.tool

## Listar produtos admin

curl -s http://localhost:3333/admin/products | python -m json.tool

## Criar produto

curl -s -X POST http://localhost:3333/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Óculos Solar Feminino Elegance",
    "slug": "oculos-solar-feminino-elegance",
    "description": "Óculos solar feminino com design elegante.",
    "price": 189.90,
    "salePrice": 159.90,
    "sku": "OSF-ELEGANCE-001",
    "brand": "Ótica ShowRoom",
    "stock": 15,
    "active": true,
    "featured": true
  }' | python -m json.tool

## Atualizar produto

curl -s -X PUT http://localhost:3333/admin/products/COLE_O_ID_AQUI \
  -H "Content-Type: application/json" \
  -d '{
    "price": 249.90,
    "stock": 12,
    "featured": true
  }' | python -m json.tool

## Desativar produto

curl -s -X DELETE http://localhost:3333/admin/products/COLE_O_ID_AQUI | python -m json.tool
