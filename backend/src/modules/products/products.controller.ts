import type { FastifyReply, FastifyRequest } from "fastify";
import {
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
  type CreateProductBody,
  type GetProductBySlugParams,
  type ProductIdParams,
  type UpdateProductBody,
} from "./products.schemas.js";
import { AppError } from "../../errors/app-error.js";

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

  return reply.send({
    data: mapProductToHttp(product),
    message: "Produto desativado com sucesso.",
  });
}