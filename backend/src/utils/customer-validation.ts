export function normalizeCpf(cpf: string) {
  return cpf.replace(/\D/g, "");
}

export function isValidCpf(cpf: string) {
  const normalizedCpf = normalizeCpf(cpf);

  if (normalizedCpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(normalizedCpf)) {
    return false;
  }

  const digits = normalizedCpf.split("").map(Number);

  const firstCheckSum = digits
    .slice(0, 9)
    .reduce((sum, digit, index) => sum + digit * (10 - index), 0);

  const firstCheckDigit = (firstCheckSum * 10) % 11;
  const normalizedFirstCheckDigit =
    firstCheckDigit === 10 ? 0 : firstCheckDigit;

  if (normalizedFirstCheckDigit !== digits[9]) {
    return false;
  }

  const secondCheckSum = digits
    .slice(0, 10)
    .reduce((sum, digit, index) => sum + digit * (11 - index), 0);

  const secondCheckDigit = (secondCheckSum * 10) % 11;
  const normalizedSecondCheckDigit =
    secondCheckDigit === 10 ? 0 : secondCheckDigit;

  return normalizedSecondCheckDigit === digits[10];
}

export function calculateAge(birthDate: Date) {
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const hasBirthdayPassedThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassedThisYear) {
    age -= 1;
  }

  return age;
}

export function isAdult(birthDate: Date) {
  return calculateAge(birthDate) >= 18;
}
