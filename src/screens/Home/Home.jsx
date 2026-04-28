import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "../../../firebase"; // Ajusta la ruta si es necesario
import bgImg from "../../assets/player/apaisada_escritor.jpeg";
import tanti1 from "../../assets/images/tanti.jpeg";
import "./homeStyles.css";

export default function Home() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [books, setBooks] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const heroRef = useRef(null);
  const nameRef = useRef(null);
  const locationRef = useRef(null);
  const messageRef = useRef(null);
  const scrollRef = useRef(null);

  // --- Pre-cargador de imágenes críticas ---
  useEffect(() => {
    const imagesToPreload = [bgImg];
    const promises = imagesToPreload.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    Promise.all(promises)
      .then(() => {
        // Pequeño retraso para asegurar que todo se renderice antes de la transición
        setTimeout(() => setIsLoaded(true), 300);
      })
      .catch((err) => console.error("Failed to preload images", err));
  }, []);

  // --- Fetch de libros desde Firestore ---
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "books"));
        const booksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  // Importar fuente cursiva dinámicamente (opcional, o poner en index.html)
  const cursiveFont = "font-['Playfair_Display',_serif] italic";
  const bodyFont = "font-serif";

  // --- Efecto Parallax y 3D con el ratón ---
  useEffect(() => {
    if (!isLoaded) return;

    const handleMouseMove = (e) => {
      if (!heroRef.current) return;

      const { clientX, clientY } = e;
      const { offsetWidth, offsetHeight } = heroRef.current;

      // Calcula la posición del ratón desde el centro de la pantalla (-1 a 1)
      const x = (clientX / offsetWidth - 0.5) * 2;
      const y = (clientY / offsetHeight - 0.5) * 2;

      // Aplica el transform con diferente intensidad para crear profundidad
      if (nameRef.current) {
        nameRef.current.style.transform = `translate(${x * -15}px, ${
          y * -10
        }px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isLoaded]);

  // --- Fetch comments from Firestore ---
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const q = query(
          collection(db, "comments"),
          orderBy("createdAt", "desc"),
          limit(50)
        );
        const querySnapshot = await getDocs(q);
        const commentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt,
        }));
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoadingComments(false);
      }
    };
    fetchComments();
  }, []);

  // --- Submit comment ---
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const name = nameRef.current?.value?.trim();
    const location = locationRef.current?.value?.trim();
    const message = messageRef.current?.value?.trim();

    if (!name || !message) {
      setSubmitMessage("Por favor, completá tu nombre y mensaje");
      setSubmitSuccess(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      await addDoc(collection(db, "comments"), {
        name: name,
        location: location || null,
        message: message,
        createdAt: serverTimestamp(),
      });

      setSubmitMessage("¡Mensaje enviado! Gracias por compartir.");
      setSubmitSuccess(true);
      
      // Clear form
      nameRef.current.value = "";
      locationRef.current.value = "";
      messageRef.current.value = "";

       // Refresh comments (only approved)
       const q = query(
         collection(db, "comments"),
         where("is_approved", "==", true),
         orderBy("createdAt", "desc"),
         limit(50)
       );
      const querySnapshot = await getDocs(q);
      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt,
      }));
      setComments(commentsData);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitMessage("");
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting comment:", error);
      setSubmitMessage("Hubo un error al enviar el mensaje. Intentá de nuevo.");
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount =
        current.clientWidth < 768
          ? current.clientWidth
          : current.clientWidth / 3;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Gustavo Villa - Escritor e Historiador</title>
        <meta name="description" content="Sitio oficial de Gustavo Villa, escritor, historiador y docente de Tanti, Córdoba. Explora sus obras literarias, biografía y proyectos sobre memoria e identidad." />
        <meta name="keywords" content="Gustavo Villa, escritor, historiador, docente, Tanti, Córdoba, literatura argentina, libros, Nostalgias, La caja de los recuerdos, Momentos, Coronados de gloria, cultura, memoria" />
        <link rel="canonical" href="https://gustavovilla.com/" />
        <meta property="og:title" content="Gustavo Villa - Escritor e Historiador" />
        <meta property="og:description" content="Sitio oficial de Gustavo Villa. Historias que unen memoria, identidad y emoción. Conoce sus libros y trayectoria." />
        <meta property="og:image" content="https://gustavovilla.com/og-image.jpg" />
        <meta property="twitter:title" content="Gustavo Villa - Escritor e Historiador" />
        <meta property="twitter:description" content="Sitio oficial de Gustavo Villa. Historias que unen memoria, identidad y emoción. Conoce sus libros y trayectoria." />
        <meta property="twitter:image" content="https://gustavovilla.com/og-image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Gustavo Villa",
            "jobTitle": "Escritor, Historiador y Docente",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Tanti",
              "addressRegion": "Córdoba",
              "addressCountry": "AR"
            },
            "url": "https://gustavovilla.com",
            "sameAs": []
          })}
        </script>
      </Helmet>
      <div className={`background-fix app-container ${isLoaded ? "loaded" : ""}`}>
      {/*PORTADA PRINCIPAL */}
      <div
        ref={heroRef}
        className="path pt-20 md:pt-44 lg:px-14 h-screen relative main-container"
        style={{ overflow: "hidden", perspective: "1000px" }}
      >
        {/* Capa de Fondo Parallax */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
          {/* Usamos bgImg como textura de fondo o elemento decorativo */}
          <img
            src={bgImg}
            alt="Fondo Textura"
            className="object-cover  w-full h-full opacity-50"
          />
        </div>

        {/* Elementos Flotantes (Parallax) */}
        <div className="relative z-10 w-full max-w-5xl lg:mx-56 flex flex-col items-center justify-center h-full pb-20">
          {/* Texto Principal (Centrado) */}
          <div ref={nameRef} className="text-start w-full px-6 drop-shadow-lg">
            <h2 className="text-blue-300 font-bold tracking-[0.2em] uppercase text-base md:text-lg mb-6">
              Escritor &middot; Historiador &middot; Docente
            </h2>
            <h1
              className={`text-6xl md:text-9xl text-[#fff] mb-8 ${cursiveFont} leading-tight`}
            >
              Gustavo <br /> <span className="text-[#1e3a8a]">Villa</span>
            </h1>
            <p
              className={`text-2xl md:text-4xl text-gray-200 mb-10 italic ${bodyFont}`}
            >
              “Historias que unen memoria, <br /> identidad y emoción.”
            </p>
            <div className="flex gap-6 justify-start">
              <Link to={"/libros"}>
                <button className="bg-[#1e3a8a] text-white px-8 py-3 rounded-sm hover:bg-[#152858] transition shadow-lg uppercase text-sm tracking-wider">
                  Conocé mis libros
                </button>
              </Link>
              <Link to={"/contacto"}>
                <button className="bg-[#774936] text-white px-8 py-3 rounded-sm hover:bg-[#5d3a2a] transition shadow-lg uppercase text-sm tracking-wider">
                  Contacto
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ---SECCIONES-------- */}
      <scroll-container>
        <div className="flex bg-[#fdfbf7] flex-col z-40 relative shadow-t-2xl">
          {/* 1. BIOGRAFÍA (Fondo claro, texto oscuro) */}
          <section className="py-24 px-6 lg:px-56 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h3 className={`text-4xl text-[#1e3a8a] mb-6 ${cursiveFont}`}>
                El valor de la memoria
              </h3>
              <div
                className={`text-lg text-gray-700 space-y-4 leading-relaxed ${bodyFont}`}
              >
                <p>
                  Soy Gustavo, y creo que escribir es una forma de resistir al
                  olvido. Desde las sierras de Tanti hasta las aulas donde
                  enseño, mi vida ha estado marcada por las historias.
                </p>
                <p>
                  Como profesor e historiador, busco en el pasado las claves de
                  nuestra identidad. Como escritor, transformo esa nostalgia en
                  relatos que nos conectan.
                </p>
                <p className="font-bold text-[#774936]">
                  Influenciado por el cine clásico y las leyendas locales, mi
                  obra es un puente entre lo que fuimos y lo que somos.
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              {/* Placeholder para foto en ambiente real */}
              <div className="w-full h-80 bg-[#e0e0e0] rounded-lg flex items-center justify-center text-gray-500 italic border border-gray-300 shadow-inner">
                <img
                  src={tanti1}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* 1.5. RECONOCIMIENTOS (Sección Intermedia - Prueba Social) */}
          <section className="py-20 px-6 lg:px-56 bg-[#774936] text-white text-center relative overflow-hidden">
            {/* Elemento decorativo de fondo */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#1e3a8a] blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h3 className={`text-3xl md:text-4xl mb-6 ${cursiveFont}`}>
                Distinciones y Premios
              </h3>
              <p className={`text-lg md:text-xl text-orange-50 mb-8 leading-relaxed ${bodyFont}`}>
                &ldquo;El mayor premio es la conexión con el lector, pero agradezco profundamente las menciones que han abrazado mi obra a lo largo del camino.&rdquo;
              </p>
              <Link to="/reconocimientos">
                <button className="border-2 border-white text-white px-8 py-3 rounded hover:bg-white hover:text-[#774936] transition duration-300 uppercase text-sm tracking-widest font-bold">
                  Ver Reconocimientos
                </button>
              </Link>
            </div>
          </section>

          {/* 2. LIBROS PUBLICADOS (Fondo Marrón/Oscuro para resaltar portadas) */}
          <section className="py-24 px-6 lg:px-56 bg-[#2c1a12] text-[#fdfbf7]">
            <div className="text-center mb-16">
              <h3 className={`text-5xl mb-4 ${cursiveFont}`}>Mis Obras</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Relatos que viajan desde el terror hasta la nostalgia más
                profunda.
              </p>
            </div>

            <div className="relative group px-4 md:px-12">
              {/* Botón Izquierda */}
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition hidden md:block"
              >
                &#10094;
              </button>

              <div
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-0 pb-4 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="min-w-full md:min-w-[33.333%] p-4 snap-center"
                  >
                    <div
                      onClick={() => navigate(`/libros/${book.id}`)}
                      className={`${
                        book.isPreorder
                          ? "bg-[#1e3a8a] relative overflow-hidden"
                          : "bg-[#3e2723] border border-[#5d4037]"
                      } p-6 rounded shadow-xl hover:-translate-y-2 transition duration-300 flex flex-col h-full cursor-pointer`}
                    >
                      {book.isPreorder && (
                        <div className="absolute top-0 right-0 bg-yellow-600 text-xs font-bold px-3 py-1">
                          PRÓXIMAMENTE
                        </div>
                      )}
                      <div className="h-96 bg-black/40 mb-4 flex items-center justify-center text-gray-400 rounded overflow-hidden">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <h4 className={`text-2xl mb-2 ${cursiveFont}`}>
                        {book.title}
                      </h4>
                      <p className="text-sm text-gray-300 mb-4 flex-grow">
                        {book.description}
                      </p>
                      <button
                        className={
                          book.isPreorder
                            ? "text-white border border-white/30 px-4 py-2 rounded hover:bg-white hover:text-[#1e3a8a] transition w-full"
                            : "text-white border border-white/30 px-4 py-2 rounded hover:bg-white hover:text-[#1e3a8a] transition w-full"
                        }
                      >
                        {book.buttonText}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón Derecha */}
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition hidden md:block"
              >
                &#10095;
              </button>
            </div>
          </section>

           {/* 3. LIBRO DE VISITAS / COMENTARIOS */}
           <section className="py-20 px-6 lg:px-56 bg-[#1e3a8a] text-white">
             <div className="max-w-4xl mx-auto">
               <h3 className={`text-4xl text-center mb-6 ${cursiveFont}`}>
                 Dejá tu mensaje
               </h3>
               <p className="text-blue-100 text-center mb-12 max-w-xl mx-auto">
                 Compartí tus impresiones o contame cómo llegaste hasta aquí. 
                 Cada mensaje es un puente entre nuestras historias.
               </p>

               {/* Formulario */}
               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-12">
                 <div className="grid md:grid-cols-2 gap-4 mb-4">
                   <input
                     type="text"
                     ref={nameRef}
                     placeholder="Tu nombre o alias"
                     className="px-4 py-3 rounded bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#774936]"
                   />
                   <input
                     type="text"
                     ref={locationRef}
                     placeholder="Tu ciudad (opcional)"
                     className="px-4 py-3 rounded bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#774936]"
                   />
                 </div>
                 <textarea
                   ref={messageRef}
                   placeholder="Escribí tu mensaje aquí..."
                   rows="3"
                   className="w-full px-4 py-3 rounded bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#774936] resize-none mb-4"
                 ></textarea>
                 <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                   <p className="text-sm text-blue-200">
                     Los mensajes son moderados antes de publicarse.
                   </p>
                   <button
                     onClick={handleSubmit}
                     disabled={isSubmitting}
                     className="bg-[#774936] hover:bg-[#5d3a2a] text-white px-8 py-3 rounded font-bold transition shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isSubmitting ? "Enviando..." : "Dejar mensaje"}
                   </button>
                 </div>
                 {submitMessage && (
                   <p className={`text-center mt-4 font-medium ${
                     submitSuccess ? "text-green-300" : "text-red-300"
                   }`}>
                     {submitMessage}
                   </p>
                 )}
               </div>

               {/* Mensajes recientes */}
               <div className="space-y-4">
                 <h4 className="text-xl font-semibold text-center mb-6">
                   Mensajes recientes
                   {comments.length > 0 && (
                     <span className="text-blue-300 ml-2">({comments.length})</span>
                   )}
                 </h4>
                 {isLoadingComments ? (
                   <p className="text-center text-blue-200 py-8">Cargando mensajes...</p>
                 ) : comments.length === 0 ? (
                   <p className="text-center text-blue-200 py-8">
                     Todavía no hay mensajes. ¡Sé el primero en dejar uno!
                   </p>
                 ) : (
                   <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                     {comments.map((comment) => (
                       <div
                         key={comment.id}
                         className="bg-white/5 rounded-lg p-4 border border-white/10"
                       >
                         <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                           <span className="font-semibold text-[#774936]">
                             {comment.name || "Anónimo"}
                           </span>
                           {comment.location && (
                             <span className="text-sm text-blue-300">
                               - {comment.location}
                             </span>
                           )}
                           <span className="text-xs text-blue-300 sm:ml-auto">
                             {comment.createdAt?.toDate?.().toLocaleDateString?.('es-AR', {
                               day: 'numeric',
                               month: 'short',
                               year: 'numeric'
                             })}
                           </span>
                         </div>
                         <p className="text-blue-100 leading-relaxed">{comment.message}</p>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             </div>
           </section>
        </div>
      </scroll-container>
    </div>
    </>
  );
}
