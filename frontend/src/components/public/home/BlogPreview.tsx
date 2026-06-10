import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  listBlogPosts,
  type BlogPost,
} from "../../../services/blog.service";


export function BlogPreview() {

  const [posts,setPosts] = useState<BlogPost[]>([]);


  useEffect(()=>{

    async function load(){

      try {

        const data = await listBlogPosts();

        setPosts(data.slice(0,3));

      } catch(error){

        console.error(
          "Erro ao carregar blog:",
          error
        );

      }

    }


    load();

  },[]);



  return (
    <section className="site-container home-section">

      <div className="section-heading">

        <span>Blog</span>

        <h2>
          Conteúdos para cuidar da sua visão
        </h2>

        <p>
          Dicas sobre lentes, armações e saúde visual.
        </p>

      </div>



      <div className="blog-page-grid">

        {posts.map((post)=>(
          <article
            className="blog-page-card"
            key={post.id}
          >

            <div className="blog-page-card-image-wrapper">

              <img
                className="blog-page-card-image"
                src={
                  post.imageUrl ??
                  "https://placehold.co/800x500"
                }
                alt={post.title}
              />

            </div>


            <div className="blog-page-card-content">


              <span>
                {post.category?.name ?? "Blog"}
              </span>


              <h3>
                {post.title}
              </h3>


              <p>
                {post.excerpt}
              </p>


              <Link
                to={`/blog/${post.slug}`}
              >
                Ler artigo
              </Link>


            </div>

          </article>
        ))}

      </div>


    </section>
  );
}