const posts = [
  {
    title: "Como escolher a armação ideal para seu rosto",
    excerpt:
      "Entenda como formato, proporção e estilo ajudam na escolha da armação.",
  },
  {
    title: "Antirreflexo, blue cut e fotossensível: qual escolher?",
    excerpt:
      "Veja diferenças entre tipos de lentes e quando cada opção pode ajudar.",
  },
  {
    title: "Quando trocar seus óculos de grau?",
    excerpt:
      "Sinais de que está na hora de revisar sua receita ou renovar suas lentes.",
  },
];

export function Blog() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <span>Blog</span>
        <h1>Dicas da Ótica ShowRoom</h1>
        <p>
          Conteúdos sobre armações, lentes, cuidados com os óculos, saúde visual
          e escolha do modelo ideal.
        </p>
      </section>

      <section className="blog-grid">
        {posts.map((post) => (
          <article key={post.title}>
            <span>Artigo</span>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
