import { useEffect, useState } from "react";
import { TiptapEditor } from "../../components/editor/TiptapEditor";
import {
  listBlogCategories,
  type BlogCategory,
} from "../../services/blog-category.service";

import { useNavigate } from "react-router-dom";

import { createBlogPost } from "../../services/blog.service";
import { uploadBlogImageFile } from "../../services/uploads.service";

export function AdminBlogCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");

  const [excerpt, setExcerpt] = useState("");

  const [content, setContent] = useState("");

  const [categoryId, setCategoryId] = useState("");

  const [categories, setCategories] = useState<BlogCategory[]>([]);

  const [imageUrl, setImageUrl] = useState("");

  const [cloudinaryPublicId, setCloudinaryPublicId] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);

  const [readingTime, setReadingTime] = useState("");

  const [published, setPublished] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await listBlogCategories();

        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadCategories();
  }, []);

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingImage(true);

      const response = await uploadBlogImageFile(file);

      setImageUrl(response.data.url);

      setCloudinaryPublicId(response.data.publicId);
    } catch (error) {
      console.error(error);

      alert("Erro ao enviar imagem.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setSubmitting(true);

      await createBlogPost({
        title,
        excerpt,
        categoryId,
        readingTime,
        published,
        imageUrl,
        cloudinaryPublicId,
        content,
      });
      navigate("/admin/blog");
    } catch (error) {
      console.error(error);

      alert("Erro ao criar artigo.");
    } finally {
      setSubmitting(false);
    }
  }
  async function handleEditorImageUpload(file: File) {
    const response = await uploadBlogImageFile(file);

    return response.data.url;
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>

          <h1>Novo artigo</h1>

          <p>Criar artigo do blog.</p>
        </div>
      </div>

      <form className="admin-form-card" onSubmit={handleSubmit}>
        <label>
          Título
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          Resumo
          <textarea
            rows={4}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </label>

        <label>
          Conteúdo
          <TiptapEditor
            value={content}
            onChange={setContent}
            uploadImage={handleEditorImageUpload}
          />
        </label>
        <label>
          Categoria
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Selecione</option>

            {categories.map((category: BlogCategory) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tempo de leitura
          <input
            value={readingTime}
            onChange={(e) => setReadingTime(e.target.value)}
            placeholder="5 min"
          />
        </label>
        <label>
          Imagem do artigo
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>

        {uploadingImage && <p>Enviando imagem...</p>}

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            style={{
              maxWidth: "300px",
              borderRadius: "8px",
              marginTop: "12px",
            }}
          />
        )}

        <label>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Publicado
        </label>

        <button className="admin-submit-button" type="submit">
          {submitting ? "Salvando..." : "Criar artigo"}
        </button>
      </form>
    </section>
  );
}
