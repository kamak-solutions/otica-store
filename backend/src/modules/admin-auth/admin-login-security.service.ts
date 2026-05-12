import { AppError } from "../../errors/app-error.js";
import { prisma } from "../../lib/prisma.js";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_IN_MINUTES = 15;

function getLockUntilDate() {
  const date = new Date();
  date.setMinutes(date.getMinutes() + LOCK_TIME_IN_MINUTES);
  return date;
}

export async function ensureAdminLoginIsNotLocked(email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  const security = await prisma.adminLoginSecurity.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!security?.lockedUntil) {
    return;
  }

  const now = new Date();

  if (security.lockedUntil > now) {
    throw new AppError(
      "Muitas tentativas de login. Tente novamente em alguns minutos.",
      429,
      "Too Many Requests",
    );
  }

  await prisma.adminLoginSecurity.update({
    where: {
      email: normalizedEmail,
    },
    data: {
      failedAttempts: 0,
      lockedUntil: null,
      lastFailedAt: null,
    },
  });
}

export async function registerAdminLoginFailure(email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  const current = await prisma.adminLoginSecurity.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  const nextFailedAttempts = (current?.failedAttempts ?? 0) + 1;

  await prisma.adminLoginSecurity.upsert({
    where: {
      email: normalizedEmail,
    },
    create: {
      email: normalizedEmail,
      failedAttempts: 1,
      lastFailedAt: new Date(),
      lockedUntil:
        nextFailedAttempts >= MAX_FAILED_ATTEMPTS ? getLockUntilDate() : null,
    },
    update: {
      failedAttempts: nextFailedAttempts,
      lastFailedAt: new Date(),
      lockedUntil:
        nextFailedAttempts >= MAX_FAILED_ATTEMPTS ? getLockUntilDate() : null,
    },
  });
}

export async function resetAdminLoginFailures(email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  await prisma.adminLoginSecurity.upsert({
    where: {
      email: normalizedEmail,
    },
    create: {
      email: normalizedEmail,
      failedAttempts: 0,
      lockedUntil: null,
      lastFailedAt: null,
    },
    update: {
      failedAttempts: 0,
      lockedUntil: null,
      lastFailedAt: null,
    },
  });
}
