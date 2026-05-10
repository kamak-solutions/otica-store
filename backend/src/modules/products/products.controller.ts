import type { FastifyReply, FastifyRequest } from "fastify";
import {
  addProductImage,
  createProduct,
  deactivateProduct,
  findProductBySlug,
  listAdminProducts,
  listProducts,
  updateProduct,
} from "./products.service.js";
import { mapProductToHttp } from "./products.mapper.js";
import {
  createProductBodySchema,
  getProductBySlugParamsSchema,
  productIdParamsSchema,
  updateProductBodySchema,
  createProductImageBodySchema,
  type CreateProductImageBody,
  type CreateProductBody,
  type GetProductBySlugParams,
  type ProductIdParams,
  type UpdateProductBody,
} from "./products.schemas.js";
import { AppError } from "../../errors/app-error.js";
import { createAdminAuditLog } from "../admin-audit/admin-audit.service.js";

export async function getProductsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing public products");

  const products = await listProducts();

  return reply.send({
    data: products.map(mapProductToHttp),
  });
}

export async function getAdminProductsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing admin products");

  const products = await listAdminProducts();

  return reply.send({
    data: products.map(mapProductToHttp),
  });
}

export async function getProductBySlugController(
  request: FastifyRequest<{
    Params: GetProductBySlugParams;
  }>,
  reply: FastifyReply,
) {
  const { slug } = getProductBySlugParamsSchema.parse(request.params);

  request.log.info({ slug }, "Finding product by slug");

  const product = await findProductBySlug(slug);

  if (!product) {
    throw new AppError("Produto não encontrado.", 404, "Not found");
  }

  return reply.send({
    data: mapProductToHttp(product),
  });
}

export async function createProductController(
  request: FastifyRequest<{
    Body: CreateProductBody;
  }>,
  reply: FastifyReply,
) {
  const body = createProductBodySchema.parse(request.body);

  request.log.info({ slug: body.slug }, "Creating product");

  const product = await createProduct(body);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "product.created",
    entity: "Product",
    entityId: product.id,
    metadata: {
      name: product.name,
      slug: product.slug,
    },
  });

  return reply.status(201).send({
    data: mapProductToHttp(product),
  });
}

export async function updateProductController(
  request: FastifyRequest<{
    Params: ProductIdParams;
    Body: UpdateProductBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = productIdParamsSchema.parse(request.params);
  const body = updateProductBodySchema.parse(request.body);

  request.log.info({ id }, "Updating product");

  const product = await updateProduct(id, body);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "product.updated",
    entity: "Product",
    entityId: product.id,
    metadata: {
      name: product.name,
      slug: product.slug,
      fields: Object.keys(body),
    },
  });

  return reply.send({
    data: mapProductToHttp(product),
  });
}

export async function deleteProductController(
  request: FastifyRequest<{
    Params: ProductIdParams;
  }>,
  reply: FastifyReply,
) {
  const { id } = productIdParamsSchema.parse(request.params);

  request.log.info({ id }, "Deactivating product");

  const product = await deactivateProduct(id);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "product.deactivated",
    entity: "Product",
    entityId: product.id,
    metadata: {
      name: product.name,
      slug: product.slug,
    },
  });

  return reply.send({
    data: mapProductToHttp(product),
    message: "Produto desativado com sucesso.",
  });
}
export async function addProductImageController(
  request: FastifyRequest<{
    Params: ProductIdParams;
    Body: CreateProductImageBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = productIdParamsSchema.parse(request.params);
  const body = createProductImageBodySchema.parse(request.body);

  request.log.info({ productId: id }, "Adding product image");

  const product = await addProductImage(id, body);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "product.image_added",
    entity: "Product",
    entityId: product.id,
    metadata: {
      name: product.name,
      slug: product.slug,
      imageUrl: body.url,
      publicId: body.publicId,
      isMain: body.isMain,
    },
  });

  return reply.status(201).send({
    data: mapProductToHttp(product),
    message: "Imagem adicionada ao produto com sucesso.",
  });
}
