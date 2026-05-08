import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../../../firebase";

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("todos");

  // Estilos compartidos
  const cursiveFont = "font-['Playfair_Display',_serif] italic";
  const bodyFont = "font-serif";

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const q = query(collection(db, "blog"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogPosts(postsData);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const categories = [
    { value: "todos", label: "Todas las notas" },
    { value: "reflexiones", label: "Reflexiones" },
    { value: "literatura", label: "Literatura" },
    { value: "escritura", label: "Escritura" },
    { value: "vida", label: "Vida" },
    { value: "novedades", label: "Novedades" },
    { value: "otros", label: "Otros" },
  ];

  const filteredPosts = selectedCategory === "todos"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2c1a12] flex items-center justify-center">
        <p className={`text-2xl text-white ${cursiveFont}`}>Cargando blog...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog - Gustavo Villa</title>
        <meta name="description" content="Reflexiones, ideas y novedades literarias de Gustavo Villa, escritor e historiador." />
        <link rel="canonical" href="https://gustavovilla.com/blog" />
        <meta property="og:title" content="Blog - Gustavo Villa" />
        <meta property="og:description" content="Reflexiones e ideas literarias de Gustavo Villa." />
        <meta property="og:url" content="https://gustavovilla.com/blog" />
      </Helmet>

      <div className="min-h-screen bg-[#fdfbf7] animate-fade-in">
        {/* Header */}
        <section className="bg-[#774936] pt-16 pb-20 px-6 lg:px-32 text-white shadow-2xl">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-5xl md:text-6xl text-white mb-8 ${cursiveFont}`}>
              Blog
            </h1>
            <div className="w-24 h-1 bg-[#1e3a8a] mx-auto mb-8"></div>
            <p className={`text-xl text-orange-50 leading-relaxed ${bodyFont} max-w-2xl mx-auto`}>
              Un espacio para compartir reflexiones, ideas y novedades literarias.
              Historias que nacen del alma y llegan al corazón.
            </p>
          </div>
        </section>

        {/* Filtro de categorías */}
        <div className="max-w-7xl mx-auto px-6 lg:px-32 py-8">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  selectedCategory === category.value
                    ? 'bg-[#1e3a8a] text-white'
                    : 'bg-white text-[#774936] border border-[#774936] hover:bg-[#774936] hover:text-white'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de notas del blog */}
        <div className="max-w-6xl mx-auto px-6 lg:px-32 pb-20">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <h2 className={`text-3xl text-[#1e3a8a] mb-4 ${cursiveFont}`}>
                {selectedCategory === "todos" ? "No hay notas" : `No hay notas en ${categories.find(c => c.value === selectedCategory)?.label.toLowerCase()}`}
              </h2>
              <p className={`text-lg text-[#774936] ${bodyFont}`}>
                {selectedCategory === "todos" ? "Próximamente nuevas reflexiones." : "Selecciona otra categoría para ver más contenido."}
              </p>
            </div>
          ) : (
            <div className="grid gap-12">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Imagen destacada */}
                  <div className="relative h-64 md:h-80 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#774936] text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                        {post.category || "Sin categoría"}
                      </span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-[#774936] font-bold uppercase text-sm tracking-widest">
                        Gustavo Villa
                      </span>
                      <span className="text-gray-400">•</span>
                      <time className="text-gray-500 text-sm">
                        {post.createdAt?.toDate?.().toLocaleDateString('es-AR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </time>
                    </div>

                    <h2 className={`text-3xl md:text-4xl text-[#1e3a8a] mb-4 ${cursiveFont}`}>
                      {post.title}
                    </h2>

                    <p className={`text-lg text-gray-700 mb-6 leading-relaxed ${bodyFont}`}>
                      {post.excerpt}
                    </p>

                    <div className="flex justify-between items-center">
                      <Link
                        to={`/blog/${post.id}`}
                        className="inline-flex items-center gap-2 bg-[#1e3a8a] text-white px-6 py-3 rounded hover:bg-[#152858] transition font-medium"
                      >
                        Leer más
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}