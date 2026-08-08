import { useState } from "react";

export interface LandingPageSection {
  id: string;
  type: "hero" | "features" | "cta" | "banner";
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
}

export interface LandingPageFormData {
  title: string;
  slug: string;
  active: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  primaryColor: string;
  sections: LandingPageSection[];
}

interface Props {
  initialData?: Partial<LandingPageFormData>;
  onSubmit: (data: LandingPageFormData) => Promise<void>;
  isLoading?: boolean;
}

export function AdminLandingPageForm({
  initialData,
  onSubmit,
  isLoading = false,
}: Props) {
  const [formData, setFormData] = useState<LandingPageFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    active: initialData?.active ?? true,
    heroTitle: initialData?.heroTitle || "",
    heroSubtitle: initialData?.heroSubtitle || "",
    heroImageUrl: initialData?.heroImageUrl || "",
    whatsappNumber: initialData?.whatsappNumber || "",
    whatsappDefaultMessage:
      initialData?.whatsappDefaultMessage || "Olá! Vim pela Landing Page.",
    primaryColor: initialData?.primaryColor || "#2563eb",
    sections: initialData?.sections || [],
  });

  // Auto-gera a slug a partir do título caso o usuário não tenha editado manualmente a slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setFormData((prev) => ({
      ...prev,
      title,
      slug:
        prev.slug === "" ||
        prev.slug === prev.title.toLowerCase().replace(/\s+/g, "-")
          ? slug
          : prev.slug,
    }));
  };

  const handleAddSection = () => {
    const newSection: LandingPageSection = {
      id: crypto.randomUUID(),
      type: "features",
      title: "Nova Seção",
      subtitle: "",
      content: "",
    };
    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const handleRemoveSection = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((sec) => sec.id !== id),
    }));
  };

  const handleSectionChange = (
    id: string,
    field: keyof LandingPageSection,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === id ? { ...sec, [field]: value } : sec,
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Informações Básicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título da Landing Page
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              className="mt-1 w-full p-2 border rounded-md"
              placeholder="Ex: Promoção Óculos de Sol 2026"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slug (URL)
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded-md bg-gray-50"
              placeholder="promocao-oculos-de-sol-2026"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="active"
            checked={formData.active}
            onChange={(e) =>
              setFormData({ ...formData, active: e.target.checked })
            }
            className="w-4 h-4 rounded text-blue-600"
          />
          <label htmlFor="active" className="text-sm font-medium text-gray-700">
            Landing Page Ativa
          </label>
        </div>
      </div>

      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Hero & Visual</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título Principal (Hero)
            </label>
            <input
              type="text"
              required
              value={formData.heroTitle}
              onChange={(e) =>
                setFormData({ ...formData, heroTitle: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subtítulo (Hero)
            </label>
            <input
              type="text"
              value={formData.heroSubtitle}
              onChange={(e) =>
                setFormData({ ...formData, heroSubtitle: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              URL da Imagem de Destaque
            </label>
            <input
              type="url"
              value={formData.heroImageUrl}
              onChange={(e) =>
                setFormData({ ...formData, heroImageUrl: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded-md"
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cor Primária (Tema)
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, primaryColor: e.target.value })
                }
                className="h-10 w-12 border rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600 font-mono">
                {formData.primaryColor}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Integração WhatsApp</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número (com DDD)
            </label>
            <input
              type="text"
              value={formData.whatsappNumber}
              onChange={(e) =>
                setFormData({ ...formData, whatsappNumber: e.target.value })
              }
              className="mt-1 w-full p-2 border rounded-md"
              placeholder="5511999999999"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mensagem Padrão
            </label>
            <input
              type="text"
              value={formData.whatsappDefaultMessage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  whatsappDefaultMessage: e.target.value,
                })
              }
              className="mt-1 w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Seções Conteúdo Dinâmico
          </h2>
          <button
            type="button"
            onClick={handleAddSection}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            + Adicionar Seção
          </button>
        </div>

        <div className="space-y-4">
          {formData.sections.map((section) => (
            <div
              key={section.id}
              className="p-4 border rounded-md bg-gray-50 relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveSection(section.id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm font-bold"
              >
                Remover
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Tipo de Seção
                  </label>
                  <select
                    value={section.type}
                    onChange={(e) =>
                      handleSectionChange(section.id, "type", e.target.value)
                    }
                    className="mt-1 w-full p-2 border rounded-md bg-white"
                  >
                    <option value="features">Destaques / Recursos</option>
                    <option value="cta">Chamada para Ação (CTA)</option>
                    <option value="banner">Banner Informativo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Título da Seção
                  </label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      handleSectionChange(section.id, "title", e.target.value)
                    }
                    className="mt-1 w-full p-2 border rounded-md bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-600">
                    Conteúdo / Descrição
                  </label>
                  <textarea
                    rows={2}
                    value={section.content || ""}
                    onChange={(e) =>
                      handleSectionChange(section.id, "content", e.target.value)
                    }
                    className="mt-1 w-full p-2 border rounded-md bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Salvando..." : "Salvar Landing Page"}
        </button>
      </div>
    </form>
  );
}
