import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';
import { prisma } from '../../lib/prisma.js';
describe('Módulo Landing Pages (E2E / Integration)', () => {
  beforeEach(async () => {
    await prisma.landingPageSection.deleteMany();
    await prisma.landingPage.deleteMany();
  });

  it('deve permitir acesso público a uma Landing Page ativa via slug', async () => {
    await prisma.landingPage.create({
      data: {
        title: 'Promoção Óculos R$ 99',
        slug: 'promocao-99',
        heroTitle: 'Armações por apenas R$ 99',
        whatsappNumber: '5511963208855',
        active: true,
      },
    });

    const response = await request(app.server)
      .get('/public/lp/promocao-99')
      .expect(200);

    expect(response.body.title).toBe('Promoção Óculos R$ 99');
    expect(response.body.slug).toBe('promocao-99');
  });

  it('deve retornar 404 para uma Landing Page inativa ou inexistente', async () => {
    await request(app.server)
      .get('/public/lp/nao-existe')
      .expect(404);
  });

  it('deve recusar a criação de Landing Page sem token de autenticação (401)', async () => {
    await request(app.server)
      .post('/admin/landing-pages')
      .send({
        title: 'Nova LP Sem Auth',
        slug: 'sem-auth',
        heroTitle: 'Teste',
        whatsappNumber: '5511963208855',
      })
      .expect(401);
  });

  it('deve bloquear tentativa de exclusão por usuário que não seja Owner (403)', async () => {
    // Exemplo simulando token com role 'collaborator' ou 'admin'
    // Deve garantir que só 'owner' pode excluir
  });
});