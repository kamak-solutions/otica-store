export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  publishedAt: string;
  readingTime: string;
  content: Array<{
    heading: string;
    paragraphs: string[];
  }>;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "como-escolher-a-armacao-ideal-para-seu-rosto",
    category: "Armações",
    title: "Como escolher a armação ideal para seu rosto",
    excerpt:
      "Entenda como formato, proporção e estilo ajudam na escolha da armação.",
    imageUrl:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-05-13",
    readingTime: "4 min de leitura",
    content: [
      {
        heading: "A armação precisa combinar conforto e proporção",
        paragraphs: [
          "Escolher uma armação não é apenas uma decisão estética. O modelo precisa ficar confortável, respeitar a largura do rosto e manter as lentes bem posicionadas diante dos olhos.",
          "Uma boa armação não escorrega com facilidade, não aperta as laterais do rosto e permite que o cliente use os óculos por várias horas sem incômodo.",
        ],
      },
      {
        heading: "Observe o formato do rosto",
        paragraphs: [
          "Rostos arredondados costumam combinar bem com armações mais retas ou angulares, pois ajudam a equilibrar as linhas faciais.",
          "Rostos mais quadrados podem ficar bem com armações arredondadas ou ovais, suavizando os traços. Já rostos ovais costumam aceitar uma variedade maior de modelos.",
        ],
      },
      {
        heading: "Pense no uso diário",
        paragraphs: [
          "Para trabalho, estudo e uso prolongado, priorize leveza e estabilidade. Para quem busca estilo, cores e formatos marcantes podem valorizar a personalidade.",
          "Na dúvida, experimente mais de um modelo e peça orientação para escolher uma opção adequada ao seu rosto, receita e rotina.",
        ],
      },
    ],
  },
  {
    slug: "antirreflexo-blue-cut-fotossensivel-qual-escolher",
    category: "Lentes",
    title: "Antirreflexo, blue cut e fotossensível: qual escolher?",
    excerpt:
      "Veja diferenças entre tipos de lentes e quando cada opção pode ajudar.",
    imageUrl:
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-05-13",
    readingTime: "5 min de leitura",
    content: [
      {
        heading: "Antirreflexo melhora o conforto visual",
        paragraphs: [
          "O tratamento antirreflexo reduz reflexos indesejados nas lentes, melhora a transparência e pode trazer mais conforto em ambientes com luz artificial, telas e direção noturna.",
          "Além do conforto, ele também melhora a aparência dos óculos, já que as lentes ficam mais limpas visualmente em fotos e conversas presenciais.",
        ],
      },
      {
        heading: "Blue cut é voltado para uso com telas",
        paragraphs: [
          "As lentes com filtro blue cut são procuradas por pessoas que passam muitas horas usando computador, celular ou tablet.",
          "Esse tipo de lente pode ajudar no conforto durante o uso de telas, mas a escolha ideal depende da rotina, da sensibilidade visual e da orientação profissional.",
        ],
      },
      {
        heading: "Fotossensível escurece no sol",
        paragraphs: [
          "As lentes fotossensíveis escurecem quando expostas à luz solar e clareiam em ambientes internos. Elas são práticas para quem alterna entre ambientes externos e internos.",
          "Para escolher corretamente, considere sua rotina, exposição ao sol, tipo de armação e necessidade de proteção.",
        ],
      },
    ],
  },
  {
    slug: "quando-trocar-seus-oculos-de-grau",
    category: "Cuidados",
    title: "Quando trocar seus óculos de grau?",
    excerpt:
      "Sinais de que está na hora de revisar sua receita ou renovar suas lentes.",
    imageUrl:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-05-13",
    readingTime: "4 min de leitura",
    content: [
      {
        heading: "Desconforto pode indicar necessidade de revisão",
        paragraphs: [
          "Dores de cabeça frequentes, dificuldade para enxergar de perto ou de longe, cansaço visual e necessidade de apertar os olhos podem indicar que está na hora de revisar a receita.",
          "Mesmo que os óculos ainda estejam em bom estado, a visão pode mudar com o tempo.",
        ],
      },
      {
        heading: "Lentes riscadas atrapalham a visão",
        paragraphs: [
          "Riscos, manchas permanentes e desgastes nos tratamentos podem prejudicar a nitidez e o conforto visual.",
          "Quando a lente já não oferece boa transparência, trocar os óculos pode melhorar bastante a experiência no dia a dia.",
        ],
      },
      {
        heading: "Armação torta ou frouxa também importa",
        paragraphs: [
          "Uma armação desalinhada pode alterar o posicionamento das lentes e prejudicar o conforto.",
          "Ajustes podem resolver alguns casos, mas quando a estrutura está danificada, pode ser melhor trocar por uma nova armação.",
        ],
      },
    ],
  },
];

export function findBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
