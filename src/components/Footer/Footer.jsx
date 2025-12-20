import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#1e3a8a] border-t border-blue-800 pt-8 pb-8 px-6 lg:px-56 flex flex-col md:flex-row justify-between items-center text-sm text-blue-300">
      <div className="flex gap-6 mb-4 md:mb-0">
        <a href="#" className="hover:text-white transition">
          Instagram
        </a>
        <a href="#" className="hover:text-white transition">
          Facebook
        </a>
        <a href="#" className="hover:text-white transition">
          WhatsApp
        </a>
      </div>
      <p>
        &copy; {new Date().getFullYear()} Gustavo. Todos los derechos
        reservados.
      </p>
    </footer>
  );
}
