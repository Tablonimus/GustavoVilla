import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebase";
import "./gallery.css";

export default function Gallery() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Estilos compartidos
  const cursiveFont = "font-['Playfair_Display',_serif] italic";
  const bodyFont = "font-serif";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const openModal = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2c1a12] flex items-center justify-center">
        <p className={`text-2xl text-white ${cursiveFont}`}>Cargando galería...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className={`text-5xl md:text-6xl text-[#1e3a8a] mb-8 ${cursiveFont}`}>
            Galería
          </h1>
          <div className="w-24 h-1 bg-[#774936] mx-auto mb-8"></div>
          <p className={`text-xl text-[#774936] leading-relaxed ${bodyFont} max-w-2xl mx-auto`}>
            No hay eventos disponibles en este momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Galería - Gustavo Villa</title>
        <meta name="description" content="Galería de eventos y momentos especiales de Gustavo Villa, escritor e historiador." />
        <link rel="canonical" href="https://gustavovilla.com/galeria" />
        <meta property="og:title" content="Galería - Gustavo Villa" />
        <meta property="og:description" content="Galería de eventos y momentos especiales de Gustavo Villa." />
        <meta property="og:image" content={events[0]?.image} />
        <meta property="og:url" content="https://gustavovilla.com/galeria" />
      </Helmet>

      <div className="min-h-screen bg-[#fdfbf7] animate-fade-in">
        {/* Header */}
        <section className="bg-[#774936] mt-16 pt-16 pb-20 px-6 lg:px-32 text-white shadow-2xl relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-5xl md:text-6xl text-white mb-8 ${cursiveFont}`}>
              Galería
            </h1>
            <div className="w-24 h-1 bg-[#1e3a8a] mx-auto mb-8"></div>
            <p className={`text-xl text-orange-50 leading-relaxed ${bodyFont} max-w-2xl mx-auto`}>
              Momentos y eventos que capturan la esencia de mi trayectoria como escritor e historiador.
            </p>
          </div>
        </section>

        {/* Carousel */}
        <div className="relative max-w-7xl mx-auto px-6 lg:px-32 py-20">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-[#fdfbf7] border-2 border-[#1e3a8a]/10">
            {/* Main Image */}
            <div className="relative h-96 md:h-[600px]">
              <img
                src={events[currentIndex].image}
                alt={events[currentIndex].title}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-500 hover:scale-105"
                onClick={() => openModal(events[currentIndex])}
              />

              {/* Overlay with text */}
              <div className="absolute inset-0 carousel-overlay">
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <div className="max-w-3xl">
                    <h2 className={`text-3xl md:text-4xl font-bold text-white mb-3 ${cursiveFont}`}>
                      {events[currentIndex].title}
                    </h2>
                    {events[currentIndex].epigraph && (
                      <p className="text-xl text-white/90 italic mb-4 font-light">
                        "{events[currentIndex].epigraph}"
                      </p>
                    )}
                    <p className="text-lg text-white/80 leading-relaxed">
                      {events[currentIndex].description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 nav-button text-white p-3 rounded-full"
                aria-label="Imagen anterior"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 nav-button text-white p-3 rounded-full"
                aria-label="Imagen siguiente"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Thumbnails */}
            <div className="bg-[#2c1a12] p-4">
              <div className="flex justify-center space-x-2 overflow-x-auto thumbnail-scroll">
                {events.map((event, index) => (
                  <button
                    key={event.id}
                    onClick={() => goToSlide(index)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 thumbnail-hover ${
                      index === currentIndex
                        ? 'border-[#774936] ring-2 ring-[#774936]/20'
                        : 'border-[#1e3a8a]/30 hover:border-[#1e3a8a]/60'
                    }`}
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover carousel-image"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Image Counter */}
          <div className="text-center mt-6">
            <p className="text-[#2c1a12] image-counter font-medium">
              {currentIndex + 1} de {events.length}
            </p>
          </div>
        </div>

        {/* Modal for full-size image */}
        {selectedEvent && (
          <div className="fixed inset-0 modal-overlay bg-[#2c1a12] bg-opacity-95 z-50 flex items-center justify-center p-4 animate-fade-in-gallery">
            <div className="relative max-w-6xl max-h-full">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />

              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 nav-button text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Event info overlay */}
              <div className="absolute bottom-0 left-0 right-0 carousel-overlay p-6 rounded-b-lg">
                <div className="max-w-4xl">
                  <h3 className={`text-3xl font-bold text-white mb-3 ${cursiveFont}`}>
                    {selectedEvent.title}
                  </h3>
                  {selectedEvent.epigraph && (
                    <p className="text-xl text-white/90 italic mb-3 font-light">
                      "{selectedEvent.epigraph}"
                    </p>
                  )}
                  <p className="text-lg text-white/80 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}