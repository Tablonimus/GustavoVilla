import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./screens/Home/Home";
import MyNav from "./components/MyNav/MyNav";
import Bio from "./components/Bio/Bio";
import Footer from "./components/Footer/Footer";
import Books from "./components/Books/Books";
import BookDetail from "./components/Books/BookDetail";
import Contacto from "./components/Contact/Contact";

function App() {
  return (
    <BrowserRouter>
      <MyNav />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/bio" element={<Bio />}></Route>
        <Route path="/libros" element={<Books />}></Route>
        <Route path="/libros/:id" element={<BookDetail />}></Route>
        <Route path="/contacto" element={<Contacto />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
