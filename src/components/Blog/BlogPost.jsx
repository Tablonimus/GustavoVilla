import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estilos compartidos
  const cursiveFont = "font-['Playfair_Display',_serif] italic";
  const bodyFont = "font-serif";

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const docRef = doc(db, "blog", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const postData = { id: docSnap.id, ...docSnap.data() };
          setPost(postData);
        } else {
          console.log("No such blog post!");
          setPost(null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2c1a12] flex items-center justify-center">
        <p className={`text-2xl text-white ${cursiveFont}`}>Cargando entrada...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className={`text-4xl md:text-5xl text-[#1e3a8a] mb-8 ${cursiveFont}`}>
            Entrada no encontrada
          </h1>
          <div className="w-24 h-1 bg-[#774936] mx-auto mb-8"></div>
          <p className={`text-xl text-[#774936] leading-relaxed ${bodyFont} mb-8 max-w-2xl mx-auto`}>
            La entrada que buscas no existe o ha sido eliminada.
          </p>
          <Link
            to="/blog"
            className="bg-[#1e3a8a] text-white px-8 py-3 rounded hover:bg-[#152858] transition font-medium"
          >
            ← Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - Blog de Gustavo Villa</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://gustavovilla.com/blog/${post.id}`} />
        <meta property="og:title" content={`${post.title} - Blog de Gustavo Villa`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:url" content={`https://gustavovilla.com/blog/${post.id}`} />
        <meta property="article:author" content="Gustavo Villa" />
        <meta property="article:published_time" content={post.createdAt?.toDate?.().toISOString()} />
      </Helmet>

      <div className="min-h-screen bg-[#fdfbf7]">
        {/* Header */}
        <section className="bg-[#774936] pt-16 pb-20 px-6 lg:px-32 text-white shadow-2xl">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-4xl md:text-5xl text-white mb-8 ${cursiveFont}`}>
              {post.title}
            </h1>
            <div className="w-24 h-1 bg-[#1e3a8a] mx-auto mb-8"></div>
            <p className={`text-xl text-orange-50 leading-relaxed ${bodyFont} max-w-2xl mx-auto italic`}>
              "{post.excerpt}"
            </p>
          </div>
        </section>

        {/* Contenido */}
        <article className="max-w-4xl mx-auto px-6 lg:px-32 py-20">
          {/* Imagen destacada */}
          <div className="mb-12">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-6 mb-8 text-gray-600 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2">
              <span className="text-[#774936] font-bold">Gustavo Villa</span>
            </div>
            <span className="text-gray-400">•</span>
            <time className="text-gray-600">
              {post.createdAt?.toDate?.().toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </time>
            <span className="text-gray-400">•</span>
            <span className="bg-[#1e3a8a] text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
              {post.category || "Sin categoría"}
            </span>
          </div>

          {/* Contenido principal */}
          <div className={`prose prose-lg max-w-none ${bodyFont}`}>
            <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
              {post.content}
            </div>
          </div>

          {/* Navegación */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Link
                to="/blog"
                className="flex items-center gap-2 text-[#1e3a8a] hover:text-[#152858] transition font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al blog
              </Link>

              <div className="flex gap-4">
                {/* Compartir en redes sociales (opcional para futuro) */}
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}