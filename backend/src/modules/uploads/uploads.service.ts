import { cloudinary } from "../../lib/cloudinary.js";

type UploadPrescriptionFileInput = {
  buffer: Buffer;
  mimetype: string;
};

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

export async function uploadPrescriptionFile({
  buffer,
  mimetype,
}: UploadPrescriptionFileInput) {
  const resourceType = mimetype === "application/pdf" ? "raw" : "image";

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "otica-showroom/prescriptions",
        resource_type: resourceType,
        access_mode: "public",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Erro ao enviar arquivo para Cloudinary."));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    uploadStream.end(buffer);
  });
}
export async function uploadProductImageFile({ buffer }: { buffer: Buffer }) {
  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "otica-showroom/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Erro ao enviar imagem para Cloudinary."));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    uploadStream.end(buffer);
  });
}
export async function uploadStorefrontImageFile({
  buffer,
}: {
  buffer: Buffer;
}) {
  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "otica-showroom/storefront",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(
            error ??
              new Error("Erro ao enviar imagem da vitrine para Cloudinary."),
          );
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    uploadStream.end(buffer);
  });
}
export async function uploadCampaignImageFile({ buffer }: { buffer: Buffer }) {
  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "otica-showroom/campaigns",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(
            error ??
              new Error("Erro ao enviar imagem da campanha para Cloudinary."),
          );

          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    uploadStream.end(buffer);
  });
}
