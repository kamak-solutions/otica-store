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
export async function uploadBlogImageFile({ buffer }: { buffer: Buffer }) {
  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "otica-showroom/blog",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Erro ao enviar imagem do blog."));

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
type CloudinaryImageUploadResult = {
  secure_url: string;
  public_id: string;
};

export async function uploadLandingPageImageFile({
  buffer,
}: {
  buffer: Buffer;
}): Promise<CloudinaryImageUploadResult> {
  return new Promise<CloudinaryImageUploadResult>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "otica-showroom/landing-pages",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(
            error ??
              new Error(
                "Erro ao enviar imagem da Landing Page para o Cloudinary.",
              ),
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


export async function deleteLandingPageImageFile(
  publicId: string,
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(
            error instanceof Error
              ? error
              : new Error(
                  "Erro ao remover imagem da Landing Page do Cloudinary.",
                ),
          );
          return;
        }

        if (result?.result === "ok" || result?.result === "not found") {
          resolve();
          return;
        }

        reject(
          new Error(
            "Cloudinary não confirmou a remoção da imagem da Landing Page.",
          ),
        );
      },
    );
  });
}
