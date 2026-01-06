import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Estilos compartidos
  const cursiveFont = "font-['Playfair_Display',_serif] italic";
  const bodyFont = "font-serif";

  useEffect(() => {
    axios
      .get("/data/books.json")
      .then((response) => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
        <p className={`text-2xl text-[#1e3a8a] ${cursiveFont}`}>Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] pt-28 pb-20 px-6 lg:px-32 animate-fade-in">
      {/* Sección Introductoria */}
      <section className="max-w-4xl mx-auto text-center mb-20">
        <h1 className={`text-5xl md:text-6xl text-[#1e3a8a] mb-8 ${cursiveFont}`}>
          Catálogo de Obras
        </h1>
        <div className="w-24 h-1 bg-[#774936] mx-auto mb-8"></div>
        <p className={`text-xl text-gray-700 leading-relaxed ${bodyFont}`}>
          Bienvenidos a este espacio de letras y emociones. Aquí presento una recopilación de mis trabajos, 
          donde cada libro es una invitación a explorar la memoria, la identidad y las historias que nos unen. 
          Selecciona una obra para conocer más detalles y solicitar tu ejemplar.
        </p>
      </section>

      {/* Lista de Libros */}
      <div className="flex flex-col gap-16">
        {books.map((book, index) => {
          // Alternar orden: Pares (0, 2...) imagen izquierda, Impares (1, 3...) imagen derecha
          const isEven = index % 2 === 0;
          
          return (
            <div
              key={book.id}
              onClick={() => navigate(`/libros/${book.id}`)}
              className={`flex flex-col md:flex-row ${
                !isEven ? "md:flex-row-reverse" : ""
              } items-center bg-white shadow-xl rounded-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group border border-gray-100`}
            >
              {/* Contenedor de Imagen */}
              <div className="w-full md:w-2/5 h-64 md:h-96 relative overflow-hidden bg-gray-100">
                <img
                  src={book.full_image}
                  alt={book.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition duration-700"
                />
                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition duration-300"></div>
                
                {book.isPreorder && (
                  <div className="absolute top-4 right-4 bg-[#1e3a8a] text-white text-xs font-bold px-3 py-1 shadow-md">
                    PRÓXIMAMENTE
                  </div>
                )}
              </div>

              {/* Contenedor de Texto */}
              <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                <h2 className={`text-3xl md:text-4xl text-[#1e3a8a] mb-4 ${cursiveFont}`}>
                  {book.title}
                </h2>
                <p className={`text-gray-600 text-lg mb-6 leading-relaxed ${bodyFont} line-clamp-4`}>
                  {book.description}
                </p>
                
                <div className={`flex ${!isEven ? "md:justify-end" : "justify-start"}`}>
                  <button className="text-[#774936] font-bold uppercase tracking-wider text-sm border-b-2 border-[#774936] pb-1 group-hover:text-[#1e3a8a] group-hover:border-[#1e3a8a] transition-colors">
                    Ver Detalles &rarr;
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
