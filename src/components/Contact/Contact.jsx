function Contacto() {  // Estilos compartidos
  const cursiveFont = "font-['Playfair_Display',_serif] italic";
  const bodyFont = "font-serif";

  // Datos de contacto (Reemplazar con los reales)
  const whatsappNumber = "5491112345678";
  const emailAddress = "contacto@gustavovilla.com";

  return (
    <div className="min-h-screen bg-[#fdfbf7] animate-fade-in pt-20">
      {/* --- HEADER / HERO --- */}
      <section className="bg-[#1e3a8a] py-20 px-6 lg:px-32 text-white text-center shadow-xl relative z-10">
        <h1 className={`text-5xl md:text-6xl mb-6 ${cursiveFont}`}>
          Contacto & Contrataciones
        </h1>
        <div className="w-24 h-1 bg-[#774936] mx-auto mb-8"></div>
        <p className={`text-xl text-blue-100 max-w-3xl mx-auto ${bodyFont} leading-relaxed`}>
          Un espacio para conectar. Ya sea para conferencias académicas, talleres literarios, 
          presentaciones de libros o proyectos de investigación histórica. 
          Estoy disponible para colaborar y seguir construyendo memoria juntos.
        </p>
      </section>

      {/* --- SERVICIOS / QUÉ OFREZCO --- */}
      <section className="py-24 px-6 lg:px-32">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl text-[#2c1a12] mb-12 text-center ${cursiveFont}`}>
            Propuestas
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Card 1 */}
            <div className="bg-white p-10 rounded-lg shadow-lg border-l-4 border-[#774936] hover:shadow-xl transition duration-300">
              <h3 className={`text-2xl text-[#1e3a8a] mb-4 ${cursiveFont}`}>Charlas y Conferencias</h3>
              <p className={`text-gray-600 leading-relaxed ${bodyFont}`}>
                Disertaciones sobre historia local, identidad cultural y el oficio de escribir. 
                Ideales para instituciones educativas, bibliotecas y centros culturales que buscan reflexionar sobre nuestro pasado.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-10 rounded-lg shadow-lg border-l-4 border-[#774936] hover:shadow-xl transition duration-300">
              <h3 className={`text-2xl text-[#1e3a8a] mb-4 ${cursiveFont}`}>Talleres Literarios</h3>
              <p className={`text-gray-600 leading-relaxed ${bodyFont}`}>
                Espacios de formación creativa enfocados en la narrativa y la memoria. 
                Herramientas para quienes desean iniciar su propio camino en la escritura o rescatar historias familiares.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-10 rounded-lg shadow-lg border-l-4 border-[#774936] hover:shadow-xl transition duration-300">
              <h3 className={`text-2xl text-[#1e3a8a] mb-4 ${cursiveFont}`}>Presentaciones de Libros</h3>
              <p className={`text-gray-600 leading-relaxed ${bodyFont}`}>
                Organización de eventos para la difusión de obras, lecturas en vivo, firmas de ejemplares y conversatorios con el autor.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-10 rounded-lg shadow-lg border-l-4 border-[#774936] hover:shadow-xl transition duration-300">
              <h3 className={`text-2xl text-[#1e3a8a] mb-4 ${cursiveFont}`}>Investigación y Consultoría</h3>
              <p className={`text-gray-600 leading-relaxed ${bodyFont}`}>
                Asesoramiento histórico para proyectos culturales, museos o medios de comunicación interesados en la preservación del patrimonio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="bg-[#2c1a12] py-24 px-6 lg:px-32 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className={`text-4xl md:text-5xl text-white mb-8 ${cursiveFont}`}>Hablemos</h2>
          <p className="text-gray-300 mb-12 max-w-xl mx-auto text-lg">
            Si tienes una propuesta o consulta, no dudes en escribirme. Responderé a la brevedad.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <a
              href={`mailto:${emailAddress}`}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded hover:bg-white hover:text-[#2c1a12] transition duration-300 uppercase font-bold tracking-wider flex items-center justify-center gap-3 min-w-[200px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Enviar Correo
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-8 py-4 rounded shadow-lg hover:bg-[#20bd5a] hover:-translate-y-1 transition duration-300 uppercase font-bold tracking-wider flex items-center justify-center gap-3 min-w-[200px]"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contacto;
