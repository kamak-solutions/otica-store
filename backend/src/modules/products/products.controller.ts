import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import {
  createProduct,
  deactivateProduct,
  findProductBySlug,
  listProducts,
  listAdminProducts,
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

function isPrismaUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

function isPrismaRecordNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}

export async function getProductsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing products");

  const products = await listProducts();

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
  try {
    const { slug } = getProductBySlugParamsSchema.parse(request.params);

    request.log.info({ slug }, "Finding product by slug");

    const product = await findProductBySlug(slug);

    if (!product) {
      return reply.status(404).send({
        error: "Product not found",
        message: "Produto não encontrado.",
      });
    }

    return reply.send({
      data: mapProductToHttp(product),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "Validation error",
        message: "Parâmetros inválidos.",
        issues: error.issues,
      });
    }

    throw error;
  }
}

export async function createProductController(
  request: FastifyRequest<{
    Body: CreateProductBody;
  }>,
  reply: FastifyReply,
) {
  try {
    const body = createProductBodySchema.parse(request.body);

    request.log.info({ slug: body.slug }, "Creating product");

    const product = await createProduct(body);

    return reply.status(201).send({
      data: mapProductToHttp(product),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "Validation error",
        message: "Dados inválidos.",
        issues: error.issues,
      });
    }

    if (isPrismaUniqueConstraintError(error)) {
      return reply.status(409).send({
        error: "Product already exists",
        message: "Já existe um produto cadastrado com este slug ou SKU.",
      });
    }

    throw error;
  }
}

export async function updateProductController(
  request: FastifyRequest<{
    Params: ProductIdParams;
    Body: UpdateProductBody;
  }>,
  reply: FastifyReply,
) {
  try {
    const { id } = productIdParamsSchema.parse(request.params);
    const body = updateProductBodySchema.parse(request.body);

    request.log.info({ id }, "Updating product");

    const product = await updateProduct(id, body);

    return reply.send({
      data: mapProductToHttp(product),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "Validation error",
        message: "Dados inválidos.",
        issues: error.issues,
      });
    }

    if (isPrismaUniqueConstraintError(error)) {
      return reply.status(409).send({
        error: "Product already exists",
        message: "Já existe um produto cadastrado com este slug ou SKU.",
      });
    }

    if (isPrismaRecordNotFoundError(error)) {
      return reply.status(404).send({
        error: "Product not found",
        message: "Produto não encontrado.",
      });
    }

    throw error;
  }
}
export async function deleteProductController(
  request: FastifyRequest<{
    Params: ProductIdParams;
  }>,
  reply: FastifyReply,
) {
  try {
    const { id } = productIdParamsSchema.parse(request.params);

    request.log.info({ id }, "Deactivating product");

    const product = await deactivateProduct(id);

    return reply.send({
      data: mapProductToHttp(product),
      message: "Produto desativado com sucesso.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "Validation error",
        message: "Dados inválidos.",
        issues: error.issues,
      });
    }

    if (isPrismaRecordNotFoundError(error)) {
      return reply.status(404).send({
        error: "Product not found",
        message: "Produto não encontrado.",
      });
    }

    throw error;
  }
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
