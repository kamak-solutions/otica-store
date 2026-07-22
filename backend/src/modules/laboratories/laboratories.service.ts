import { prisma } from "../../lib/prisma.js";

export async function listLaboratories() {
  return prisma.laboratory.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

type CreateLaboratoryData = {
  code?: string;
  name: string;
  companyName?: string;
  contactName?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  city?: string;
  state?: string;
  averageDeliveryDays?: number;
  acceptsApi?: boolean;
  notes?: string;
};

export async function createLaboratory(data: CreateLaboratoryData) {
  return prisma.laboratory.create({
    data: {
      code: data.code || null,
      name: data.name,
      companyName: data.companyName || null,
      contactName: data.contactName || null,
      phone: data.phone || null,
      whatsapp: data.whatsapp || null,
      email: data.email || null,
      website: data.website || null,
      city: data.city || null,
      state: data.state || null,
      averageDeliveryDays: data.averageDeliveryDays ?? null,
      acceptsApi: data.acceptsApi ?? false,
      notes: data.notes || null,
    },
  });
}

type UpdateLaboratoryData = Partial<CreateLaboratoryData>;

export async function updateLaboratory(id: string, data: UpdateLaboratoryData) {
  return prisma.laboratory.update({
    where: { id },
    data,
  });
}

export async function deactivateLaboratory(id: string) {
  return prisma.laboratory.update({
    where: { id },
    data: {
      active: false,
    },
  });
}
