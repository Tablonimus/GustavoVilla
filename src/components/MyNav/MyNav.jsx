import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logoEquipo from "../../assets/logos/argentina.png";

export default function MyNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Cambia el fondo de la nav al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/bio", text: "Biografía" },
    { to: "/libros", text: "Libros" },
    { to: "/galeria", text: "Galería" },
    { to: "/contacto", text: "Contacto" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isOpen
          ? "bg-black/90 shadow-lg text-white"
          : "bg-transparent text-blue-500"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-12 flex-shrink-0 items-center gap-3"
        >
          <img
            src={logoEquipo}
            alt="Logo Equipo"
            className="h-full w-full object-contain"
          />
          <span className="whitespace-nowrap font-semibold uppercase tracking-wider transition-colors hover:text-blue-500 ">
            Gustavo Villa
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center space-x-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-semibold uppercase tracking-wider transition-colors hover:text-blue-500"
            >
              {link.text}
            </Link>
          ))}
          {/* <a href="#suela" className="transition-transform hover:scale-110">
            <img
              src={logoSuela}
              alt="Suela Caramelo"
              className="h-12 w-12 object-cover"
            />
          </a> */}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Abrir menú">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`bg-black/95 md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="flex flex-col items-center space-y-6 py-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-xl font-semibold uppercase tracking-wider transition-colors hover:text-blue-500"
              onClick={() => setIsOpen(false)}
            >
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
