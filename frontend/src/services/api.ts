const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error(
    "VITE_API_URL não configurada.",
  );
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {

  const hasBody = Boolean(
    options?.body,
  );

  const isFormData =
    options?.body instanceof FormData;

  const token =
    window.localStorage.getItem(
      "@otica-showroom:admin-token",
    );

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,

      headers: {
        ...(hasBody && !isFormData
          ? {
              "Content-Type":
                "application/json",
            }
          : {}),

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),

        ...options?.headers,
      },
    },
  );

  let data = null;

  const contentType =
    response.headers.get(
      "content-type",
    );

  if (
    contentType &&
    contentType.includes(
      "application/json",
    )
  ) {
    data = await response.json();
  }

  if (!response.ok) {

    if (response.status === 401) {

      window.localStorage.removeItem(
        "@otica-showroom:admin-token",
      );

      window.localStorage.removeItem(
        "@otica-showroom:admin-user",
      );

      if (
        window.location.pathname.startsWith(
          "/admin",
        ) &&
        window.location.pathname !==
          "/admin/login"
      ) {
        window.location.href =
          "/admin/login";
      }
    }

    throw new Error(
      data?.message ||
        "Erro ao buscar dados da API.",
    );
  }

  return data;
}