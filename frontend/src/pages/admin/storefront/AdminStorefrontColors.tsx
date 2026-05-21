import { useEffect, useState } from "react";
import {
  getAdminTheme,
  updateAdminTheme,
  type UpdateStorefrontThemePayload,
} from "../../../services/admin-storefront.service";
import type { StorefrontTheme } from "../../../services/storefront.service";

type ThemeFormData = UpdateStorefrontThemePayload;

const colorFields: Array<{
  key: keyof ThemeFormData;
  label: string;
  description: string;
}> = [
  {
    key: "primaryColor",
    label: "Cor principal",
    description: "Base da marca, botões e elementos principais.",
  },
  {
    key: "secondaryColor",
    label: "Cor secundária",
    description: "Destaques comerciais e chamadas fortes.",
  },
  {
    key: "accentColor",
    label: "Cor de destaque",
    description: "Detalhes, selos, bordas especiais e pequenos realces.",
  },
  {
    key: "backgroundColor",
    label: "Cor de fundo",
    description: "Fundo geral da vitrine.",
  },
  {
    key: "surfaceColor",
    label: "Cor dos cards",
    description: "Cards, caixas e áreas elevadas.",
  },
  {
    key: "titleColor",
    label: "Cor dos títulos",
    description: "Títulos principais e chamadas de impacto.",
  },
  {
    key: "textColor",
    label: "Cor dos textos",
    description: "Parágrafos, descrições e textos secundários.",
  },
  {
    key: "borderColor",
    label: "Cor das bordas",
    description: "Bordas suaves de cards, inputs e divisões.",
  },
  {
    key: "buttonTextColor",
    label: "Texto dos botões",
    description: "Cor do texto sobre botões principais.",
  },
];

const defaultTheme: ThemeFormData = {
  primaryColor: "#6F330B",
  secondaryColor: "#E75900",
  accentColor: "#B8914B",
  backgroundColor: "#F9F4EF",
  surfaceColor: "#FFFFFF",
  titleColor: "#2C2520",
  textColor: "#7F7169",
  borderColor: "#E7D8CC",
  buttonTextColor: "#FFFFFF",
  bannerContentOpacity: 68,
};

function createFormDataFromTheme(theme: StorefrontTheme): ThemeFormData {
  return {
    primaryColor: theme.primaryColor,
    secondaryColor: theme.secondaryColor,
    accentColor: theme.accentColor,
    backgroundColor: theme.backgroundColor,
    surfaceColor: theme.surfaceColor,
    titleColor: theme.titleColor,
    textColor: theme.textColor,
    borderColor: theme.borderColor,
    buttonTextColor: theme.buttonTextColor,
    bannerContentOpacity: theme.bannerContentOpacity,
  };
}

export function AdminStorefrontColors() {
  const [formData, setFormData] = useState<ThemeFormData>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadTheme() {
    try {
      setErrorMessage("");

      const response = await getAdminTheme();

      setFormData(createFormDataFromTheme(response.data));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao carregar tema.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTheme();
  }, []);

  function updateColorField(key: keyof ThemeFormData, value: string) {
    setFormData((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  }
  function updateNumberField(key: keyof ThemeFormData, value: number) {
    setFormData((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  }

  async function handleSaveTheme() {
    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await updateAdminTheme(formData);

      setFormData(createFormDataFromTheme(response.data));
      setSuccessMessage("Cores da vitrine atualizadas com sucesso.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao salvar cores.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleRestoreDefault() {
    setFormData(defaultTheme);
    setSuccessMessage(
      "Paleta padrão carregada. Clique em salvar para aplicar.",
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Vitrine</span>
          <h1>Cores</h1>
          <p>Configure a identidade visual da vitrine com a paleta da marca.</p>
        </div>

        <button type="button" onClick={handleSaveTheme} disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar cores"}
        </button>
      </div>

      {errorMessage && (
        <p className="admin-state-message admin-error-message">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p className="admin-state-message admin-success-message">
          {successMessage}
        </p>
      )}

      {isLoading ? (
        <p className="admin-state-message">Carregando cores...</p>
      ) : (
        <>
          <div className="admin-storefront-help-card">
            <strong>Paleta sugerida</strong>
            <p>
              Marrom como cor principal, laranja como destaque comercial e tons
              claros para manter sofisticação e boa leitura.
            </p>

            <button type="button" onClick={handleRestoreDefault}>
              Restaurar paleta da marca
            </button>
          </div>

          <div className="admin-theme-preview-card">
            <div>
              <span style={{ color: formData.accentColor }}>
                Prévia da vitrine
              </span>
              <h2 style={{ color: formData.titleColor }}>
                Ótica ShowRoom com sua identidade
              </h2>
              <p style={{ color: formData.textColor }}>
                Veja como títulos, textos e botões podem conversar com a paleta
                visual da marca.
              </p>

              <button
                type="button"
                style={{
                  background: formData.primaryColor,
                  color: formData.buttonTextColor,
                }}
              >
                Botão principal
              </button>

              <button
                type="button"
                style={{
                  background: formData.secondaryColor,
                  color: formData.buttonTextColor,
                }}
              >
                Destaque
              </button>
            </div>
          </div>
          <div className="admin-theme-range-card">
            <div>
              <strong>Transparência do card dos banners</strong>
              <span>
                Controla quanto da imagem aparece atrás do texto dos banners
                secundários.
              </span>
            </div>

            <div className="admin-theme-range-control">
              <input
                type="range"
                min="20"
                max="95"
                step="1"
                value={formData.bannerContentOpacity ?? 68}
                onChange={(event) =>
                  updateNumberField(
                    "bannerContentOpacity",
                    Number(event.target.value),
                  )
                }
              />

              <strong>{formData.bannerContentOpacity ?? 68}%</strong>
            </div>
          </div>

          <div className="admin-theme-grid">
            {colorFields.map((field) => (
              <label className="admin-theme-color-card" key={field.key}>
                <div>
                  <strong>{field.label}</strong>
                  <span>{field.description}</span>
                </div>

                <div className="admin-theme-color-inputs">
                  <input
                    type="color"
                    value={formData[field.key] ?? "#000000"}
                    onChange={(event) =>
                      updateColorField(field.key, event.target.value)
                    }
                  />

                  <input
                    type="text"
                    value={formData[field.key] ?? ""}
                    onChange={(event) =>
                      updateColorField(field.key, event.target.value)
                    }
                    placeholder="#000000"
                  />
                </div>
              </label>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
