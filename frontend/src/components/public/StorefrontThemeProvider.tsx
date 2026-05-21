import { useEffect } from "react";
import { getPublicTheme } from "../../services/storefront.service";

function applyThemeVariable(name: string, value: string) {
  document.documentElement.style.setProperty(name, value);
}

export function StorefrontThemeProvider() {
  useEffect(() => {
    async function loadTheme() {
      try {
        const response = await getPublicTheme();
        const theme = response.data;

        applyThemeVariable("--storefront-primary", theme.primaryColor);
        applyThemeVariable("--storefront-secondary", theme.secondaryColor);
        applyThemeVariable("--storefront-accent", theme.accentColor);
        applyThemeVariable("--storefront-background", theme.backgroundColor);
        applyThemeVariable("--storefront-surface", theme.surfaceColor);
        applyThemeVariable("--storefront-title", theme.titleColor);
        applyThemeVariable("--storefront-text", theme.textColor);
        applyThemeVariable("--storefront-border", theme.borderColor);
        applyThemeVariable("--storefront-button-text", theme.buttonTextColor);
      } catch (error) {
        console.error("Erro ao carregar tema da vitrine:", error);
      }
    }

    loadTheme();
  }, []);

  return null;
}
