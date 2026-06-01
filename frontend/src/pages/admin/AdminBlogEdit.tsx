import { useEffect, useState } from "react";

import {
  listBlogCategories,
  type BlogCategory,
} from "../../services/blog-category.service";

import { useNavigate, useParams } from "react-router-dom";

import { getBlogPostById, updateBlogPost } from "../../services/blog.service";
import { uploadBlogImageFile } from "../../services/uploads.service";

export function AdminBlogEdit() {
  const navigate = useNavigate();

  const { id } = useParams();

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
    async function loadPost() {
      if (!id) return;

      try {
        const post = await getBlogPostById(id);

        setTitle(post.title);

        setExcerpt(post.excerpt);

        setContent(
          post.content.flatMap((section) => section.paragraphs).join("\n\n"),
        );

        setCategoryId(post.categoryId ?? "");

        setReadingTime(post.readingTime ?? "");

        setImageUrl(post.imageUrl ?? "");

        setPublished(post.published);
      } catch (error) {
        console.error(error);
      }
    }

    loadPost();
  }, [id]);
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

    if (!id) {
      alert("Artigo não encontrado.");
      return;
    }

    try {
      setSubmitting(true);

      await updateBlogPost(id, {
        title,
        excerpt,
        categoryId,
        readingTime,
        published,
        imageUrl,
        cloudinaryPublicId,
        content: [
          {
            heading: "Conteúdo",
            paragraphs: content.split("\n").filter(Boolean),
          },
        ],
      });

      navigate("/admin/blog");
    } catch (error) {
      console.error(error);

      alert("Erro ao atualizar artigo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <span>Admin</span>

          <h1>Editar artigo</h1>

          <p>Editar artigo do blog.</p>
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
          <textarea
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Digite o conteúdo do artigo..."
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
          {submitting ? "Salvando..." : "Atualizar artigo"}
        </button>
      </form>
    </section>
  );
}
