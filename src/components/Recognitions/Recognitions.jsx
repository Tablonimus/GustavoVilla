import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

export default function Recognitions() {
  const [recognitions, setRecognitions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estilos compartidos
  const cursiveFont = "font-['Playfair_Display',_serif] italic";
  const bodyFont = "font-serif";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recognitions"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecognitions(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recognitions:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2c1a12] flex items-center justify-center">
        <p className={`text-2xl text-white ${cursiveFont}`}>Cargando reconocimientos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] animate-fade-in">
      {/* Sección Introductoria */}
      <section className="bg-[#774936] mt-20 pt-16 pb-20 px-6 lg:px-32 text-white shadow-2xl relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-5xl md:text-6xl text-white mb-8 ${cursiveFont}`}>
            Reconocimientos
          </h1>
          <div className="w-24 h-1 bg-[#1e3a8a] mx-auto mb-8"></div>
          <p className={`text-xl text-orange-50 leading-relaxed ${bodyFont}`}>
            El camino de las letras a veces nos regala momentos inolvidables. 
            Aquí comparto algunas distinciones y menciones que han abrazado mi obra, 
            agradeciendo siempre a quienes confían en mis historias.
          </p>
        </div>
      </section>

      {/* Lista de Reconocimientos */}
      <div className="max-w-6xl mx-auto px-6 lg:px-32 py-20 grid gap-12">
        {recognitions.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
          >
            {/* Imagen del reconocimiento */}
            <div className="w-full md:w-1/3 h-64 md:h-80 relative overflow-hidden bg-gray-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Texto */}
            <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
              <span className="text-[#774936] font-bold tracking-widest uppercase text-sm mb-2">
                Otorgado por: {item.issuer}
              </span>
              <h2 className={`text-3xl md:text-4xl text-[#1e3a8a] mb-4 ${cursiveFont}`}>
                {item.title}
              </h2>
              <p className={`text-gray-600 text-lg leading-relaxed ${bodyFont}`}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
        
        {recognitions.length === 0 && (
            <div className="text-center text-gray-500 py-10">
                <p>Aún no hay reconocimientos cargados.</p>
            </div>
        )}
      </div>
    </div>
  );
}
