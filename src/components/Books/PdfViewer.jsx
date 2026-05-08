import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export default function PdfViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estilos compartidos
  const cursiveFont = "font-['Playfair_Display',_serif] italic";
  const bodyFont = "font-serif";

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const docRef = doc(db, "books", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const bookData = { id: docSnap.id, ...docSnap.data() };
          setBook(bookData);
        } else {
          console.log("No such document!");
          setBook(null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2c1a12] flex items-center justify-center">
        <p className={`text-2xl text-white ${cursiveFont}`}>
          Cargando fragmento...
        </p>
      </div>
    );
  }

  if (!book || !book.pdf_fragment) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center">
        <div className="text-center">
          <h1
            className={`text-4xl md:text-5xl text-[#1e3a8a] mb-8 ${cursiveFont}`}
          >
            Fragmento del Libro
          </h1>
          <div className="w-24 h-1 bg-[#774936] mx-auto mb-8"></div>
          <p
            className={`text-xl text-[#774936] leading-relaxed ${bodyFont} mb-8 max-w-2xl mx-auto`}
          >
            Fragmento no disponible
          </p>
          <button
            onClick={() => navigate(`/libros/${id}`)}
            className="bg-[#1e3a8a] text-white px-8 py-3 rounded hover:bg-[#152858] transition"
          >
            ← Volver al libro
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Fragmento - {book.title} - Gustavo Villa</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-[#fdfbf7] animate-fade-in">
        {/* Header */}
        <section className="bg-[#774936] mt-20 pt-16 pb-20 px-6 lg:px-32 text-white shadow-2xl relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h1
                  className={`text-4xl md:text-5xl text-white mb-4 ${cursiveFont}`}
                >
                  {book.title}
                </h1>
                <div className="w-24 h-1 bg-[#1e3a8a] mb-4"></div>
                <p
                  className={`text-xl text-orange-50 leading-relaxed ${bodyFont}`}
                >
                  Fragmento del Libro
                </p>
              </div>
              <div className="ml-8">
                <button
                  onClick={() => navigate(`/libros/${id}`)}
                  className="bg-[#1e3a8a] text-white px-6 py-3 rounded-full hover:bg-[#152858] hover:scale-105 transition duration-300 uppercase font-bold tracking-wider whitespace-nowrap"
                >
                  ← Volver al libro
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PDF Viewer */}
        <div className="max-w-7xl mx-auto px-6 lg:px-32  pt-2 pb-20">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-[#1e3a8a]/10">
            <div className="bg-[#fdfbf7] p-4">
              <iframe
                src={book.pdf_fragment}
                className="w-full h-[70vh] border-0 rounded"
                title={`Fragmento de ${book.title}`}
                allowFullScreen
              />
            </div>

            <div className="p-6 bg-[#2c1a12] border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className={`text-xl text-white mb-2 ${cursiveFont}`}>
                    {book.title}
                  </h2>
                  <p className={`text-sm text-orange-50 ${bodyFont}`}>
                    Si el PDF no se carga correctamente, puedes descargarlo
                    usando el botón inferior.
                  </p>
                </div>
                <a
                  href={book.pdf_fragment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#774936] text-white px-4 py-2 rounded-full hover:bg-[#5d3a2a] hover:scale-105 transition duration-300 uppercase font-bold tracking-wider text-sm whitespace-nowrap"
                >
                  📥 Descargar PDF
                </a>
              </div>
            </div>

            {/* Call to Action - Solicitar Ejemplar */}
            <div className="mt-8 bg-[#f8f4f0] p-8 rounded-lg border-2 border-[#774936]/20 text-center">
              <h3 className={`text-2xl text-[#774936] mb-4 ${cursiveFont}`}>
                ¿Te gustó este fragmento?
              </h3>
              <p className={`text-lg text-[#2c1a12] leading-relaxed mb-6 ${bodyFont}`}>
                Espero que hayas disfrutado leyendo este pedazo de mi obra. Si te interesa leer el libro completo,
                puedes solicitar un ejemplar poniéndote en contacto conmigo.
              </p>
              <a
                href="https://wa.me/5491234567890?text=Hola%20Gustavo,%20le%C3%AD%20el%20fragmento%20de%20tu%20libro%20y%20me%20gustar%C3%ADa%20solicitar%20un%20ejemplar%20completo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full shadow-lg hover:bg-[#20bd5a] hover:scale-105 transition duration-300 uppercase font-bold tracking-wider"
              >
                📱 Solicitar Ejemplar por WhatsApp
              </a>
              <p className={`text-sm text-gray-600 mt-4 ${bodyFont}`}>
                Respondo lo antes posible para coordinar la entrega.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
