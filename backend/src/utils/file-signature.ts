type AllowedFileType = "jpg" | "png" | "webp" | "pdf";

type FileSignatureValidationInput = {
  buffer: Buffer;
  allowedTypes: AllowedFileType[];
};

function isJpeg(buffer: Buffer) {
  return buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff;
}

function isPng(buffer: Buffer) {
  return buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;
}

function isWebp(buffer: Buffer) {
  return buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP";
}

function isPdf(buffer: Buffer) {
  return buffer.length >= 4 && buffer.toString("ascii", 0, 4) === "%PDF";
}

export function detectFileType(buffer: Buffer): AllowedFileType | null {
  if (isJpeg(buffer)) {
    return "jpg";
  }

  if (isPng(buffer)) {
    return "png";
  }

  if (isWebp(buffer)) {
    return "webp";
  }

  if (isPdf(buffer)) {
    return "pdf";
  }

  return null;
}

export function validateFileSignature({
  buffer,
  allowedTypes,
}: FileSignatureValidationInput) {
  const detectedType = detectFileType(buffer);

  if (!detectedType) {
    return {
      valid: false,
      detectedType: null,
    };
  }

  return {
    valid: allowedTypes.includes(detectedType),
    detectedType,
  };
}
