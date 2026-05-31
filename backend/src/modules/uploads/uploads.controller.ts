import type { FastifyReply, FastifyRequest } from "fastify";
import { validateFileSignature } from "../../utils/file-signature.js";
import { AppError } from "../../errors/app-error.js";
import {
  uploadPrescriptionFile,
  uploadProductImageFile,
  uploadStorefrontImageFile,
  uploadCampaignImageFile,
  uploadBlogImageFile,
} from "./uploads.service.js";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export async function uploadPrescriptionController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const file = await request.file();

  if (!file) {
    throw new AppError("Arquivo não enviado.", 400, "Bad Request");
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new AppError(
      "Tipo de arquivo inválido. Envie JPG, PNG, WEBP ou PDF.",
      400,
      "Bad Request",
    );
  }

  const buffer = await file.toBuffer();

  const signatureValidation = validateFileSignature({
    buffer,
    allowedTypes: ["jpg", "png", "webp", "pdf"],
  });

  if (!signatureValidation.valid) {
    throw new AppError(
      "Arquivo inválido. A assinatura do arquivo não corresponde a JPG, PNG, WEBP ou PDF.",
      400,
      "Bad Request",
    );
  }

  const uploadedFile = await uploadPrescriptionFile({
    buffer,
    mimetype: file.mimetype,
  });
  return reply.status(201).send({
    data: {
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
      originalFilename: file.filename,
      mimetype: file.mimetype,
    },
    message: "Receita enviada com sucesso.",
  });
}
const allowedProductImageMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export async function uploadProductImageController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const file = await request.file();

  if (!file) {
    throw new AppError("Imagem não enviada.", 400, "Bad Request");
  }

  if (!allowedProductImageMimeTypes.includes(file.mimetype)) {
    throw new AppError(
      "Tipo de imagem inválido. Envie JPG, PNG ou WEBP.",
      400,
      "Bad Request",
    );
  }

  const buffer = await file.toBuffer();

  const signatureValidation = validateFileSignature({
    buffer,
    allowedTypes: ["jpg", "png", "webp"],
  });

  if (!signatureValidation.valid) {
    throw new AppError(
      "Imagem inválida. A assinatura do arquivo não corresponde a JPG, PNG ou WEBP.",
      400,
      "Bad Request",
    );
  }

  const uploadedFile = await uploadProductImageFile({
    buffer,
  });

  return reply.status(201).send({
    data: {
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
      originalFilename: file.filename,
      mimetype: file.mimetype,
    },
    message: "Imagem do produto enviada com sucesso.",
  });
}
export async function uploadStorefrontImageController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const file = await request.file();

  if (!file) {
    throw new AppError("Imagem não enviada.", 400, "Bad Request");
  }

  if (!allowedProductImageMimeTypes.includes(file.mimetype)) {
    throw new AppError(
      "Tipo de imagem inválido. Envie JPG, PNG ou WEBP.",
      400,
      "Bad Request",
    );
  }

  const buffer = await file.toBuffer();

  const signatureValidation = validateFileSignature({
    buffer,
    allowedTypes: ["jpg", "png", "webp"],
  });

  if (!signatureValidation.valid) {
    throw new AppError(
      "Imagem inválida. A assinatura do arquivo não corresponde a JPG, PNG ou WEBP.",
      400,
      "Bad Request",
    );
  }

  const uploadedFile = await uploadStorefrontImageFile({
    buffer,
  });

  return reply.status(201).send({
    data: {
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
      originalFilename: file.filename,
      mimetype: file.mimetype,
    },
    message: "Imagem da vitrine enviada com sucesso.",
  });
}
export async function uploadCampaignImageController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const file = await request.file();

  if (!file) {
    throw new AppError("Imagem não enviada.", 400, "Bad Request");
  }

  if (!allowedProductImageMimeTypes.includes(file.mimetype)) {
    throw new AppError(
      "Tipo de imagem inválido. Envie JPG, PNG ou WEBP.",
      400,
      "Bad Request",
    );
  }

  const buffer = await file.toBuffer();

  const signatureValidation = validateFileSignature({
    buffer,
    allowedTypes: ["jpg", "png", "webp"],
  });

  if (!signatureValidation.valid) {
    throw new AppError("Imagem inválida.", 400, "Bad Request");
  }

  const uploadedFile = await uploadCampaignImageFile({
    buffer,
  });

  return reply.status(201).send({
    data: {
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
      originalFilename: file.filename,
      mimetype: file.mimetype,
    },

    message: "Imagem da campanha enviada com sucesso.",
  });
}
export async function uploadBlogImageController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const file = await request.file();

  if (!file) {
    throw new AppError("Imagem não enviada.", 400, "Bad Request");
  }

  const buffer = await file.toBuffer();

  const uploadedFile = await uploadBlogImageFile({
    buffer,
  });

  return reply.status(201).send({
    data: {
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
    },
  });
}
