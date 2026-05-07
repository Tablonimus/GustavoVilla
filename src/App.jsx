import "./App.css";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import Home from "./screens/Home/Home";
import MyNav from "./components/MyNav/MyNav";
import Bio from "./components/Bio/Bio";
import Footer from "./components/Footer/Footer";
import Books from "./components/Books/Books";
import BookDetail from "./components/Books/BookDetail";
import PdfViewer from "./components/Books/PdfViewer";
import Gallery from "./components/Gallery/Gallery";
import Blog from "./components/Blog/Blog";
import BlogPost from "./components/Blog/BlogPost";
import Contacto from "./components/Contact/Contact";
import AdminBooks from "./screens/Admin/Dashboard";
import Recognitions from "./components/Recognitions/Recognitions";

const PublicLayout = () => (
  <>
    <MyNav />
    <Outlet />
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas (con Nav y Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/bio" element={<Bio />}></Route>
          <Route path="/libros" element={<Books />}></Route>
          <Route path="/libros/:id" element={<BookDetail />}></Route>
          <Route path="/libros/:id/fragmento" element={<PdfViewer />}></Route>
          <Route path="/galeria" element={<Gallery />}></Route>
          <Route path="/blog" element={<Blog />}></Route>
          <Route path="/blog/:id" element={<BlogPost />}></Route>
          <Route path="/reconocimientos" element={<Recognitions />}></Route>
          <Route path="/contacto" element={<Contacto />}></Route>
        </Route>

        {/* Rutas Admin (sin Nav y Footer) */}
        <Route path="/admin" element={<AdminBooks />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
