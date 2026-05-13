import { onlyDigits } from "../utils/input-masks";

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

export async function searchZipcode(zipcode: string) {
  const digits = onlyDigits(zipcode);

  if (digits.length !== 8) {
    return null;
  }

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);

  if (!response.ok) {
    throw new Error("Erro ao buscar CEP.");
  }

  const data = (await response.json()) as ViaCepResponse;

  if (data.erro) {
    throw new Error("CEP não encontrado.");
  }

  return {
    zipcode: data.cep ?? zipcode,
    street: data.logradouro ?? "",
    complement: data.complemento ?? "",
    district: data.bairro ?? "",
    city: data.localidade ?? "",
    state: data.uf ?? "",
  };
}
