import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estilos compartidos
  const cursiveFont = "font-['Playfair_Display',_serif] italic";
  const bodyFont = "font-serif";

  useEffect(() => {
    axios
      .get("/data/books.json")
      .then((response) => {
        // Buscamos el libro que coincida con el ID de la URL
        const foundBook = response.data.find((b) => b.id == id);
        setBook(foundBook);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching book details:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
        <p className={`text-2xl text-[#1e3a8a] ${cursiveFont}`}>Cargando...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center gap-4">
        <p className={`text-2xl text-[#774936] ${cursiveFont}`}>
          Libro no encontrado
        </p>
        <button
          onClick={() => navigate("/")}
          className="text-[#1e3a8a] underline hover:text-[#152858]"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  // Configuración del mensaje de WhatsApp
  // Reemplaza '5491112345678' con el número real de contacto
  const whatsappNumber = "5491112345678";
  const message = `Hola, estoy interesado en el libro "${book.title}" y me gustaría obtener un ejemplar.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className=" min-h-screen bg-[#fdfbf7] text-gray-800 relative animate-fade-in">
      <div className="container mx-auto px-6 py-24 lg:px-32 flex flex-col justify-center min-h-screen">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Columna Imagen */}
          <div className="flex justify-center order-2 md:order-1">
            <div
              className={`relative p-8 rounded-lg shadow-2xl ${
                book.isPreorder ? "bg-[#1e3a8a]" : "bg-[#3e2723]"
              }`}
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full max-w-xs md:max-w-sm object-cover shadow-lg transform hover:scale-105 transition duration-500"
              />
            </div>
          </div>

          {/* Columna Detalles */}
          <div className="flex flex-col justify-center order-1 md:order-2">
            <h1
              className={`text-5xl md:text-6xl text-[#1e3a8a] mb-6 leading-tight ${cursiveFont}`}
            >
              {book.title}
            </h1>
            <div className="w-24 h-1 bg-[#774936] mb-8"></div>

            <p
              className={`text-xl text-gray-600 mb-8 leading-relaxed ${bodyFont} italic`}
            >
              {book.description}
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded shadow-lg hover:bg-[#20bd5a] hover:-translate-y-1 transition duration-300 uppercase font-bold tracking-wider w-full md:w-auto"
            >
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Solicitar Ejemplar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
