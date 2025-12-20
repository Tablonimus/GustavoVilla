import React from "react";
import portraitImg from "../../assets/player/frente_escritor.jpeg";
import landscapeImg from "../../assets/player/apaisada_escritor.jpeg";

export default function Bio() {
  // Mismas fuentes que en Home.jsx para consistencia
  const cursiveFont = "font-['Playfair_Display',_serif] italic";
  const bodyFont = "font-serif";

  return (
    <div className="bg-[#fdfbf7] min-h-screen py-20 px-6 lg:px-32 text-gray-800">
      <div className="max-w-5xl mx-auto animate-fade-in">
        
        {/* --- ENCABEZADO --- */}
        <header className="mb-16 text-center">
          <h2 className="text-[#774936] font-bold tracking-widest uppercase text-sm mb-4">
            Trayectoria y Vida
          </h2>
          <h1 className={`text-5xl md:text-6xl text-[#1e3a8a] mb-6 ${cursiveFont}`}>
            Gustavo Augusto Alexis Villa
          </h1>
          <div className="w-24 h-1 bg-[#774936] mx-auto rounded-full"></div>
        </header>

        {/* --- SECCIÓN 1: INTRODUCCIÓN Y RETRATO --- */}
        <div className="grid md:grid-cols-12 gap-12 items-start mb-20">
          <div className={`md:col-span-7 space-y-6 text-lg leading-relaxed text-gray-700 ${bodyFont}`}>
            <p>
              <span className="font-bold text-[#1e3a8a] text-xl">Gustavo Augusto Alexis Villa</span> nació en Rosario, provincia de Santa Fe, en 1981. Reside actualmente en <span className="italic text-[#774936] font-semibold">Tanti, Córdoba</span>, un pueblo de las sierras que se ha convertido en su espacio de inspiración, creación y memoria.
            </p>
            <p>
              Es profesor de Historia, escritor, realizador y productor cinematográfico, docente universitario y vicedirector del IPETyM N.º 84, donde coordina proyectos educativos y culturales que integran la enseñanza con la creatividad y la reflexión social.
            </p>
            <p>
              Diplomado en Política Internacional y en Gestión Educativa, ha construido una trayectoria que une la formación académica, la gestión institucional y la producción artística. Su mirada pedagógica y humanista se proyecta tanto en el aula como en sus obras literarias y audiovisuales, en las que la educación, la historia y el arte se entrelazan como formas de conocimiento y transformación.
            </p>
          </div>
          
          {/* Foto Retrato con efecto de marco desplazado */}
          <div className="md:col-span-5 relative group">
            <div className="absolute inset-0 bg-[#1e3a8a] translate-x-3 translate-y-3 rounded-sm transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
            <img 
              src={portraitImg} 
              alt="Gustavo Villa Retrato" 
              className="relative z-10 w-full h-auto rounded-sm shadow-xl grayscale group-hover:grayscale-0 transition duration-700 object-cover border border-gray-200"
            />
          </div>
        </div>

        {/* --- SECCIÓN 2: OBRA LITERARIA (Texto ancho) --- */}
        <div className={`mb-20 p-8 bg-white border-l-4 border-[#774936] shadow-sm space-y-6 text-lg leading-relaxed ${bodyFont}`}>
           <h3 className={`text-3xl text-[#1e3a8a] mb-2 ${cursiveFont}`}>La Escritura como Resistencia</h3>
           <p>
             Como escritor, es autor de los libros <span className="font-bold text-[#774936]">Nostalgias</span> (Editorial Autores de Argentina), <span className="italic">La caja del tiempo</span>, <span className="italic">Momentos</span>, <span className="italic">Tanti del ayer</span> y <span className="italic">Coronados de gloria</span>, estos tres últimos actualmente en proceso de edición.
           </p>
           <p>
             Su escritura se distingue por un tono introspectivo y poético, donde convergen la memoria, el amor, el paso del tiempo y la identidad. En sus relatos, la nostalgia no es solo melancolía, sino un modo de resistencia frente al olvido y una búsqueda de sentido frente al devenir de la vida.
           </p>
        </div>

        {/* --- SEPARADOR VISUAL: IMAGEN APAISADA --- */}
        <div className="mb-20 relative overflow-hidden rounded-sm shadow-2xl group">
           <img 
             src={landscapeImg} 
             alt="Gustavo Villa en Feria del Libro" 
             className="w-full h-80 md:h-96 object-cover transform group-hover:scale-105 transition duration-1000"
           />
           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2c1a12] to-transparent p-6">
              <p className="text-white/90 italic text-center text-sm md:text-base">Presentación de obras y encuentro con lectores.</p>
           </div>
        </div>

        {/* --- SECCIÓN 3: AUDIOVISUAL Y PROYECTOS --- */}
        <div className={`grid md:grid-cols-2 gap-16 items-start ${bodyFont}`}>
          <div className="space-y-4 text-lg leading-relaxed text-gray-700">
            <h3 className={`text-2xl text-[#1e3a8a] mb-4 border-b border-gray-200 pb-2 ${cursiveFont}`}>Cine y Comunicación</h3>
            <p>
              En el ámbito audiovisual, Villa ha recibido premios internacionales como productor ejecutivo del mediometraje <span className="italic font-semibold">Azucena, un ocaso de la vida</span>, reconocido por su sensibilidad estética y su tratamiento de los vínculos humanos.
            </p>
            <p>
              Además, participó en varios largometrajes, entre ellos <span className="italic">Babilonia</span>, y se ha desempeñado como conductor y productor radial y televisivo, promoviendo espacios de difusión cultural y reflexión social.
            </p>
          </div>
          
          <div className="space-y-4 text-lg leading-relaxed text-gray-700">
            <h3 className={`text-2xl text-[#774936] mb-4 border-b border-gray-200 pb-2 ${cursiveFont}`}>Proyectos en Curso</h3>
            <p>
              Actualmente desarrolla nuevos proyectos literarios, entre ellos el libro <span className="italic font-semibold">Cuentos e historias</span>, que reúne relatos de tono autobiográfico y filosófico, y una novela ambientada en Tanti, que combina elementos de suspenso, emoción y memoria.
            </p>
            <p>
              También trabaja en una obra teatral breve de ciencia ficción y drama, basada en un sueño que mezcla lo poético y lo distópico.
            </p>
          </div>
        </div>

        {/* --- CIERRE / FOOTER --- */}
        <div className="mt-24 pt-12 border-t border-[#1e3a8a]/20 text-center">
          <p className={`text-xl md:text-3xl text-gray-600 italic max-w-4xl mx-auto leading-normal ${cursiveFont}`}>
            “La palabra, la educación y el arte son herramientas esenciales para comprendernos como individuos y como sociedad.”
          </p>
          <p className="mt-6 text-sm text-[#774936] uppercase tracking-widest font-bold">Gustavo Villa</p>
        </div>

      </div>
    </div>
  );
}