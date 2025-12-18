import { useState, useEffect, useRef } from "react";
import img1 from "../../assets/player/7.webp"; // Imagen frontal
import img2 from "../../assets/player/8.webp"; // Imagen de espalda
import bgImg from "../../assets/player/1.webp"; // Importamos la imagen de fondo
import "./homeStyles.css";


export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const nameRef = useRef(null);

  // --- Pre-cargador de imágenes críticas ---
  useEffect(() => {
    const imagesToPreload = [img1, img2, bgImg];
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
      if (img1Ref.current) {
        img1Ref.current.style.transform = `translate(${x * 25}px, ${
          y * 15
        }px) rotateY(${x * 15}deg) rotateX(${-y * 10}deg)`;
      }
      if (img2Ref.current) {
        img2Ref.current.style.transform = `translate(${x * 10}px, ${
          y * 8
        }px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isLoaded]);

  return (
    <div className={`background-fix app-container ${isLoaded ? "loaded" : ""}`}>
      {/*PORTADA PRINCIPAL */}
      <div
        ref={heroRef}
        className="path pt-20 md:pt-44 lg:px-14 h-screen relative main-container"
      >

      </div>
      {/* ---SECCIONES-------- */}
      <scroll-container>
        <div className="flex bg-black/20 flex-col pt-20 pb-14 lg:px-56 gap-5 z-40">
          {/* AQUI VAN COMPONENTES QUE IRAND PONIENDO SECTIONS */}
        </div>
      </scroll-container>
    </div>
  );
}
