import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useBooks } from "../../hooks/useBooks";
import { useRecognitions } from "../../hooks/useRecognitions";
import { useBanners } from "../../hooks/useBanners";
import { useEvents } from "../../hooks/useEvents";
import { useBlog } from "../../hooks/useBlog";

// --- ICONOS SVG (Componentes simples para no depender de librerías externas) ---
const IconBook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
);
const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);
const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);
const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);
const IconAward = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/><path d="M21 10.59A8.4 8.4 0 0 0 3 10.59"/></svg>
);
const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconMessageSquare = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const IconImage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);
const IconCamera = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h1.586a1 1 0 0 1 .707.293l.707.707A1 1 0 0 0 13.414 11H15m-6 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
);
const IconBookOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/><path d="M6 8h2"/><path d="M6 12h2"/><path d="M16 8h2"/><path d="M16 12h2"/><path d="M12 8v8"/></svg>
);
const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);

export default function AdminBooks() {
  // --- ESTADOS DE NAVEGACIÓN ---
  const [activeTab, setActiveTab] = useState("books"); // 'books', 'recognitions', 'comments', 'banners'
  const [view, setView] = useState("list"); // 'list' | 'form'

  const [sidebarOpen, setSidebarOpen] = useState(true);

   // --- HOOKS PARA DATOS ---
    const { books, loading: booksLoading, uploading: booksUploading, fetchBooks, handleSubmit: handleBookSubmit, handleDelete: handleBookDelete } = useBooks();
    const { recognitions, loading: recognitionsLoading, uploading: recognitionsUploading, fetchRecognitions, handleSaveRecognition, handleDeleteRecognition } = useRecognitions();
    const { banners, loading: bannersLoading, uploading: bannersUploading, fetchBanners, handleSubmit: handleBannerSubmit, handleDelete: handleBannerDelete } = useBanners();
    const { events, loading: eventsLoading, uploading: eventsUploading, fetchEvents, handleSubmit: handleEventSubmit, handleDelete: handleEventDelete } = useEvents();
    const { blogPosts, loading: blogLoading, uploading: blogUploading, fetchBlogPosts, handleSubmit: handleBlogSubmit, handleDelete: handleBlogDelete } = useBlog();

   // Comentarios
   const [comments, setComments] = useState([]);
   const [commentsLoading, setCommentsLoading] = useState(false);

  // --- ESTADOS DE FORMULARIOS ---
  const [editingId, setEditingId] = useState(null);
   const [imageFile, setImageFile] = useState(null); // Archivo de portada
   const [fullImageFile, setFullImageFile] = useState(null); // Archivo de fondo
   const [pdfFile, setPdfFile] = useState(null); // Archivo PDF de fragmento
  const [recognitionImageFile, setRecognitionImageFile] = useState(null); // Archivo de reconocimiento
   const [editingRecognitionId, setEditingRecognitionId] = useState(null);
   const [bannerImageFile, setBannerImageFile] = useState(null);
   const [editingBannerId, setEditingBannerId] = useState(null);
   const [eventImageFile, setEventImageFile] = useState(null);
   const [editingEventId, setEditingEventId] = useState(null);
   const [blogImageFile, setBlogImageFile] = useState(null);
   const [editingBlogId, setEditingBlogId] = useState(null);

  // Estado inicial del formulario limpio
  const initialFormState = {
    title: "",
    description: "",
    full_description: "",
    image: "",
    full_image: "",
    pdf_fragment: "",
    buttonText: "Ver Mas",
    isPreorder: false,
  };
  
  // Estado del formulario
  const [formData, setFormData] = useState(initialFormState);
    // Estado del formulario de reconocimiento
    const [formRecognitionData, setFormRecognitionData] = useState({
      title: "",
      description: "",
      image: "",
      issuer: "",
    });

    // Estado del formulario de banner
    const [formBannerData, setFormBannerData] = useState({
      title: "",
      description: "",
      image: "",
      eventDate: "",
      isActive: true,
    });

    // Estado del formulario de evento
    const [formEventData, setFormEventData] = useState({
      title: "",
      description: "",
      image: "",
      epigraph: "",
    });

    // Estado del formulario del blog
    const [formBlogData, setFormBlogData] = useState({
      title: "",
      excerpt: "",
      content: "",
      image: "",
      category: "",
    });

   // --- EFECTOS PARA CARGAR DATOS ---


    // Cargar libros inicialmente (solo en montaje)
    useEffect(() => {
      fetchBooks();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Refrescar datos cuando se cambia de pestaña
   // --- FUNCIONES PARA COMENTARIOS ---
   const fetchComments = useCallback(async () => {
     setCommentsLoading(true);
     try {
       const q = query(
         collection(db, "comments"),
         orderBy("createdAt", "desc")
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
       setCommentsLoading(false);
     }
   }, []);

   const handleApproveComment = async (commentId) => {
     try {
       await updateDoc(doc(db, "comments", commentId), {
         is_approved: true,
       });
       // Actualizar localmente
       setComments(comments.map(c => 
         c.id === commentId ? { ...c, is_approved: true } : c
       ));
     } catch (error) {
       console.error("Error approving comment:", error);
     }
   };

   const handleDeleteComment = async (commentId) => {
     if (!window.confirm("¿Estás seguro de que deseas eliminar este comentario?")) return;
     try {
       await deleteDoc(doc(db, "comments", commentId));
       setComments(comments.filter(c => c.id !== commentId));
     } catch (error) {
       console.error("Error deleting comment:", error);
     }
   };




  // --- MANEJADORES PARA LIBROS ---
  const handleBookFormSubmit = async (e) => {
    e.preventDefault();
    await handleBookSubmit(formData, imageFile, fullImageFile, pdfFile, editingId);
    resetForm();
    setView("list");
  };

  const handleRecognitionFormSubmit = async (e) => {
    e.preventDefault();
    await handleSaveRecognition(formRecognitionData, recognitionImageFile, editingRecognitionId);
    resetRecognitionForm();
    setView("list");
  };



  // Cargar datos en el formulario para editar
  const handleEdit = (book) => {
    setEditingId(book.id);
    setFormData(book);
    setImageFile(null);
    setFullImageFile(null);
    setPdfFile(null);
    setView("form"); // Cambiar a vista de formulario
  };





  const handleEditRecognition = (rec) => {
    setEditingRecognitionId(rec.id);
    setFormRecognitionData(rec);
    setRecognitionImageFile(null);
    setView("form");
  }

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setImageFile(null);
    setFullImageFile(null);
    setPdfFile(null);
    setView("list");
  };

  const resetRecognitionForm = () => {
    setFormRecognitionData({
      title: "",
      description: "",
      image: "",
      issuer: "",
    });
    setEditingRecognitionId(null);
    setRecognitionImageFile(null);
    setView("list");
  };

  const resetBannerForm = () => {
    setFormBannerData({
      title: "",
      description: "",
      image: "",
      eventDate: "",
      isActive: true,
    });
    setEditingBannerId(null);
    setBannerImageFile(null);
    setView("list");
  };

  const resetEventForm = () => {
    setFormEventData({
      title: "",
      description: "",
      image: "",
      epigraph: "",
    });
    setEditingEventId(null);
    setEventImageFile(null);
    setView("list");
  };

  const resetBlogForm = () => {
    setFormBlogData({
      title: "",
      excerpt: "",
      content: "",
      image: "",
      category: "",
    });
    setEditingBlogId(null);
    setBlogImageFile(null);
    setView("list");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRecognitionChange = (e) => {
    const { name, value } = e.target;
    setFormRecognitionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    if (field === "image") {
      setImageFile(e.target.files[0]);
    } else if (field === "full_image") {
      setFullImageFile(e.target.files[0]);
    }
  };

  const handleRecognitionFileChange = (e) => {
    setRecognitionImageFile(e.target.files[0]);
  };

  const handleBannerChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormBannerData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBannerFileChange = (e) => {
    setBannerImageFile(e.target.files[0]);
  };

  const handleBannerFormSubmit = async (e) => {
    e.preventDefault();
    await handleBannerSubmit(formBannerData, bannerImageFile, editingBannerId);
    resetBannerForm();
    setView("list");
  };

  const handleEditBanner = (banner) => {
    setEditingBannerId(banner.id);
    setFormBannerData(banner);
    setBannerImageFile(null);
    setView("form");
  };

  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setFormEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEventFileChange = (e) => {
    setEventImageFile(e.target.files[0]);
  };

  const handleEventFormSubmit = async (e) => {
    e.preventDefault();
    await handleEventSubmit(formEventData, eventImageFile, editingEventId);
    resetEventForm();
    setView("list");
  };

  const handleEditEvent = (event) => {
    setEditingEventId(event.id);
    setFormEventData(event);
    setEventImageFile(null);
    setView("form");
  };

  const handleBlogChange = (e) => {
    const { name, value } = e.target;
    setFormBlogData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlogFileChange = (e) => {
    setBlogImageFile(e.target.files[0]);
  };

  const handleBlogFormSubmit = async (e) => {
    e.preventDefault();
    await handleBlogSubmit(formBlogData, blogImageFile, editingBlogId);
    resetBlogForm();
    setView("list");
  };

  const handleEditBlog = (blogPost) => {
    setEditingBlogId(blogPost.id);
    setFormBlogData(blogPost);
    setBlogImageFile(null);
    setView("form");
  };

    useEffect(() => {
      if (activeTab === 'books') {
        fetchBooks();
      }
      if (activeTab === 'recognitions') {
        fetchRecognitions();
      }
      if (activeTab === 'comments') {
        fetchComments();
      }
      if (activeTab === 'banners') {
        fetchBanners();
      }
      if (activeTab === 'events') {
        fetchEvents();
      }
      if (activeTab === 'blog') {
        fetchBlogPosts();
      }
    }, [activeTab, fetchBooks, fetchRecognitions, fetchComments, fetchBanners, fetchEvents, fetchBlogPosts]);




  // --- RENDERIZADO ---
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-gray-100 flex font-sans text-gray-800">
      
      {/* --- SIDEBAR --- */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-[#1e3a8a] text-white transition-all duration-300 flex flex-col fixed h-full z-20 shadow-xl`}>
        <div className="p-6 flex items-center justify-between border-b border-blue-800">
          {sidebarOpen && <span className="font-bold text-xl tracking-wider font-serif">Gustavo Villa</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-blue-800 rounded">
            <IconMenu />
          </button>
        </div>
        
        <nav className="flex-1 py-6">
          <ul>
            <li 
              className={`px-6 py-4 cursor-pointer flex items-center gap-4 transition-colors ${activeTab === 'books' ? 'bg-[#774936] border-l-4 border-white' : 'hover:bg-blue-800'}`}
              onClick={() => { setActiveTab('books'); setView('list'); }}
            >
              <IconBook />
              {sidebarOpen && <span>Libros</span>}
            </li>
            {/* Aquí se pueden agregar más módulos en el futuro */}
            <li 
              className={`px-6 py-4 cursor-pointer flex items-center gap-4 transition-colors ${activeTab === 'recognitions' ? 'bg-[#774936] border-l-4 border-white' : 'hover:bg-blue-800'}`}
              onClick={() => { setActiveTab('recognitions'); setView('list'); }}
            >
              <IconAward />
              {sidebarOpen && <span>Reconocimientos</span>}
            </li>
             <li
               className={`px-6 py-4 cursor-pointer flex items-center gap-4 transition-colors ${activeTab === 'comments' ? 'bg-[#774936] border-l-4 border-white' : 'hover:bg-blue-800'}`}
               onClick={() => { setActiveTab('comments'); setView('list'); }}
             >
               <IconMessageSquare />
               {sidebarOpen && <span>Comentarios</span>}
             </li>
             <li
               className={`px-6 py-4 cursor-pointer flex items-center gap-4 transition-colors ${activeTab === 'banners' ? 'bg-[#774936] border-l-4 border-white' : 'hover:bg-blue-800'}`}
               onClick={() => { setActiveTab('banners'); setView('list'); }}
             >
               <IconImage />
               {sidebarOpen && <span>Banner Principal</span>}
             </li>
             <li
               className={`px-6 py-4 cursor-pointer flex items-center gap-4 transition-colors ${activeTab === 'events' ? 'bg-[#774936] border-l-4 border-white' : 'hover:bg-blue-800'}`}
               onClick={() => { setActiveTab('events'); setView('list'); }}
             >
               <IconCamera />
               {sidebarOpen && <span>Eventos</span>}
             </li>
             <li
               className={`px-6 py-4 cursor-pointer flex items-center gap-4 transition-colors ${activeTab === 'blog' ? 'bg-[#774936] border-l-4 border-white' : 'hover:bg-blue-800'}`}
               onClick={() => { setActiveTab('blog'); setView('list'); }}
             >
               <IconBookOpen />
               {sidebarOpen && <span>Blog</span>}
             </li>

           </ul>
        </nav>
        
        <div className="p-6 border-t border-blue-800 text-sm text-blue-300">
          {sidebarOpen && <p>&copy; 2024 Admin Panel</p>}
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} p-8`}>
        
         {/* HEADER SUPERIOR */}
         <header className="flex justify-between items-center mb-8">
           <div>
              <h1 className="text-3xl font-bold text-[#1e3a8a] font-serif">
                {activeTab === 'books' ? "Gestión de Libros" :
                 activeTab === 'recognitions' ? "Gestión de Reconocimientos" :
                 activeTab === 'comments' ? "Moderación de Comentarios" :
                 activeTab === 'banners' ? "Gestión de Banner Principal" :
                 activeTab === 'events' ? "Gestión de Eventos" :
                 "Gestión del Blog"}
              </h1>
              <p className="text-gray-500">
                {activeTab === 'books' ? "Administra el catálogo de obras literarias." :
                 activeTab === 'recognitions' ? "Administra los premios y menciones recibidos." :
                 activeTab === 'comments' ? "Aprueba o elimina los comentarios del libro de visitas." :
                 activeTab === 'banners' ? "Administra los banners principales para eventos próximos." :
                 activeTab === 'events' ? "Administra las fotos y eventos para la galería." :
                 "Comparte tus ideas, reflexiones y novedades literarias."}
              </p>
           </div>
            {(activeTab === 'books' || activeTab === 'recognitions' || activeTab === 'banners' || activeTab === 'events' || activeTab === 'blog') && view === "list" && (
              <button
                onClick={() => {
                  if (activeTab === 'books') resetForm();
                  else if (activeTab === 'recognitions') resetRecognitionForm();
                  else if (activeTab === 'banners') resetBannerForm();
                  else if (activeTab === 'events') resetEventForm();
                  else resetBlogForm();
                  setView("form");
                }}
                className="bg-[#774936] text-white px-4 py-2 rounded shadow hover:bg-[#5d3a2a] transition flex items-center gap-2"
              >
                <IconPlus /> {activeTab === 'books' ? "Nuevo Libro" : activeTab === 'recognitions' ? "Nuevo Reconocimiento" : activeTab === 'banners' ? "Nuevo Banner" : activeTab === 'events' ? "Nuevo Evento" : "Nueva Entrada"}
              </button>
            )}
         </header>

        {/* --- VISTA: FORMULARIO LIBROS --- */}
        {activeTab === 'books' && view === "form" && (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#774936] mb-4">
            {editingId ? "Editar Libro" : "Agregar Nuevo Libro"}
          </h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-[#1e3a8a] flex items-center gap-1">
              <IconArrowLeft /> Volver a la lista
            </button>
          </div>

          <form onSubmit={handleBookFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Título</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                required
              />
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Texto Botón</label>
              <input
                type="text"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-bold mb-2">Descripción Corta</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                rows="2"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-bold mb-2">Descripción Completa</label>
              <textarea
                name="full_description"
                value={formData.full_description}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                rows="4"
                required
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Imagen Portada</label>
              {formData.image && <img src={formData.image} alt="Actual" className="h-20 mb-2 rounded object-cover" />}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "image")}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                required={!editingId} // Requerido solo si es nuevo
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-bold mb-2">Imagen Completa (Fondo)</label>
              {formData.full_image && <img src={formData.full_image} alt="Actual Full" className="h-20 mb-2 rounded object-cover" />}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "full_image")}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-bold mb-2">PDF de Fragmento del Libro</label>
              {formData.pdf_fragment && (
                <div className="mb-2">
                  <a
                    href={formData.pdf_fragment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    Ver PDF actual
                  </a>
                </div>
              )}
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
              <p className="text-sm text-gray-500 mt-1">Sube un PDF con fragmentos del libro para que los lectores puedan leer sin salir del sitio.</p>
            </div>

            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                name="isPreorder"
                checked={formData.isPreorder}
                onChange={handleChange}
                className="w-5 h-5 text-[#1e3a8a]"
              />
              <label className="text-gray-700 font-bold">Es Pre-venta (Próximamente)</label>
            </div>

            <div className="col-span-2 flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-[#1e3a8a] text-white px-6 py-2 rounded hover:bg-blue-900 transition font-bold"
                  disabled={recognitionsUploading}
              >
                {booksUploading ? "Subiendo..." : (editingId ? "Actualizar Libro" : "Guardar Libro")}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition font-bold"
              >
                Cancelar
              </button>
            </div>
          </form>
          </div>
        )}

        {/* --- VISTA: FORMULARIO BANNERS --- */}
        {activeTab === 'banners' && view === "form" && (
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#774936] mb-4">
                {editingBannerId ? "Editar Banner" : "Agregar Nuevo Banner"}
              </h2>
              <button onClick={resetBannerForm} className="text-gray-500 hover:text-[#1e3a8a] flex items-center gap-1">
                <IconArrowLeft /> Volver a la lista
              </button>
            </div>

            <form onSubmit={handleBannerFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-700 font-bold mb-2">Título del Evento</label>
                <input
                  type="text"
                  name="title"
                  value={formBannerData.title}
                  onChange={handleBannerChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-700 font-bold mb-2">Fecha del Evento</label>
                <input
                  type="date"
                  name="eventDate"
                  value={formBannerData.eventDate}
                  onChange={handleBannerChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-bold mb-2">Descripción</label>
                <textarea
                  name="description"
                  value={formBannerData.description}
                  onChange={handleBannerChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  rows="3"
                  placeholder="Detalles del evento..."
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-bold mb-2">Imagen del Banner</label>
                {formBannerData.image && <img src={formBannerData.image} alt="Banner actual" className="h-32 mb-2 rounded object-cover" />}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerFileChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required={!editingBannerId}
                />
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formBannerData.isActive}
                  onChange={handleBannerChange}
                  className="w-5 h-5 text-[#1e3a8a]"
                />
                <label className="text-gray-700 font-bold">Banner activo (visible en el sitio)</label>
              </div>

              <div className="col-span-2 flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-[#1e3a8a] text-white px-6 py-2 rounded hover:bg-blue-900 transition font-bold"
                  disabled={bannersUploading}
                >
                  {bannersUploading ? "Subiendo..." : (editingBannerId ? "Actualizar Banner" : "Guardar Banner")}
                </button>
                <button
                  type="button"
                  onClick={resetBannerForm}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition font-bold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- VISTA: FORMULARIO EVENTOS --- */}
        {activeTab === 'events' && view === "form" && (
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#774936] mb-4">
                {editingEventId ? "Editar Evento" : "Agregar Nuevo Evento"}
              </h2>
              <button onClick={resetEventForm} className="text-gray-500 hover:text-[#1e3a8a] flex items-center gap-1">
                <IconArrowLeft /> Volver a la lista
              </button>
            </div>

            <form onSubmit={handleEventFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-700 font-bold mb-2">Título del Evento</label>
                <input
                  type="text"
                  name="title"
                  value={formEventData.title}
                  onChange={handleEventChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-700 font-bold mb-2">Epígrafe</label>
                <input
                  type="text"
                  name="epigraph"
                  value={formEventData.epigraph}
                  onChange={handleEventChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  placeholder="Una frase corta descriptiva..."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-bold mb-2">Descripción</label>
                <textarea
                  name="description"
                  value={formEventData.description}
                  onChange={handleEventChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  rows="4"
                  placeholder="Describe el evento..."
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-bold mb-2">Imagen del Evento</label>
                {formEventData.image && <img src={formEventData.image} alt="Evento actual" className="h-32 mb-2 rounded object-cover" />}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEventFileChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required={!editingEventId}
                />
              </div>

              <div className="col-span-2 flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-[#1e3a8a] text-white px-6 py-2 rounded hover:bg-blue-900 transition font-bold"
                  disabled={eventsUploading}
                >
                  {eventsUploading ? "Subiendo..." : (editingEventId ? "Actualizar Evento" : "Guardar Evento")}
                </button>
                <button
                  type="button"
                  onClick={resetEventForm}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition font-bold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- VISTA: FORMULARIO BLOG --- */}
        {activeTab === 'blog' && view === "form" && (
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#774936] mb-4">
                {editingBlogId ? "Editar Entrada del Blog" : "Nueva Entrada del Blog"}
              </h2>
              <button onClick={resetBlogForm} className="text-gray-500 hover:text-[#1e3a8a] flex items-center gap-1">
                <IconArrowLeft /> Volver a la lista
              </button>
            </div>

            <form onSubmit={handleBlogFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-700 font-bold mb-2">Título</label>
                <input
                  type="text"
                  name="title"
                  value={formBlogData.title}
                  onChange={handleBlogChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-700 font-bold mb-2">Categoría</label>
                <select
                  name="category"
                  value={formBlogData.category}
                  onChange={handleBlogChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                >
                  <option value="">Seleccionar categoría...</option>
                  <option value="reflexiones">Reflexiones</option>
                  <option value="literatura">Literatura</option>
                  <option value="escritura">Escritura</option>
                  <option value="vida">Vida</option>
                  <option value="novedades">Novedades</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-bold mb-2">Extracto (Resumen corto)</label>
                <textarea
                  name="excerpt"
                  value={formBlogData.excerpt}
                  onChange={handleBlogChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  rows="2"
                  placeholder="Un resumen breve de la entrada..."
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-bold mb-2">Contenido</label>
                <textarea
                  name="content"
                  value={formBlogData.content}
                  onChange={handleBlogChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  rows="8"
                  placeholder="Escribe el contenido de tu entrada del blog..."
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-bold mb-2">Imagen Destacada</label>
                {formBlogData.image && <img src={formBlogData.image} alt="Blog actual" className="h-32 mb-2 rounded object-cover" />}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBlogFileChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required={!editingBlogId}
                />
                <p className="text-sm text-gray-500 mt-1">Imagen que representará tu entrada del blog</p>
              </div>

              <div className="col-span-2 flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-[#1e3a8a] text-white px-6 py-2 rounded hover:bg-blue-900 transition font-bold"
                  disabled={blogUploading}
                >
                  {blogUploading ? "Guardando..." : (editingBlogId ? "Actualizar Entrada" : "Publicar Entrada")}
                </button>
                <button
                  type="button"
                  onClick={resetBlogForm}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition font-bold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- VISTA: LISTADO LIBROS (TABLA) --- */}
        {activeTab === 'books' && view === "list" && (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
             {booksLoading ? (
            <div className="p-12 text-center text-gray-500">Cargando catálogo...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 border-b border-gray-200 uppercase text-xs tracking-wider">
                    <th className="p-4">Portada</th>
                    <th className="p-4">Título</th>
                    <th className="p-4">Descripción Corta</th>
                    <th className="p-4 text-center">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {books.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <img src={book.image} alt={book.title} className="w-12 h-16 object-cover rounded shadow-sm" />
                      </td>
                      <td className="p-4 font-bold text-[#1e3a8a]">{book.title}</td>
                      <td className="p-4 text-gray-600 text-sm max-w-xs truncate">{book.description}</td>
                      <td className="p-4 text-center">
                        {book.isPreorder ? (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">Pre-venta</span>
                        ) : (
                          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">Publicado</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(book)}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded transition"
                            title="Editar"
                          >
                            <IconEdit />
                          </button>
                          <button
                            onClick={() => handleBookDelete(book.id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded transition"
                            title="Eliminar"
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {books.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        No hay libros registrados. ¡Agrega uno nuevo!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {/* --- VISTA: FORMULARIO RECONOCIMIENTOS --- */}
        {activeTab === 'recognitions' && view === "form" && (
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#774936] mb-4">
                {editingRecognitionId ? "Editar Reconocimiento" : "Agregar Nuevo Reconocimiento"}
              </h2>
              <button onClick={resetRecognitionForm} className="text-gray-500 hover:text-[#1e3a8a] flex items-center gap-1">
                <IconArrowLeft /> Volver a la lista
              </button>
            </div>

            <form onSubmit={handleRecognitionFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-700 font-bold mb-2">Título del Premio</label>
                <input
                  type="text"
                  name="title"
                  value={formRecognitionData.title}
                  onChange={handleRecognitionChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required
                />
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-700 font-bold mb-2">Otorgado por (Issuer)</label>
                <input
                  type="text"
                  name="issuer"
                  value={formRecognitionData.issuer}
                  onChange={handleRecognitionChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-bold mb-2">Descripción</label>
                <textarea
                  name="description"
                  value={formRecognitionData.description}
                  onChange={handleRecognitionChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  rows="3"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 font-bold mb-2">Imagen</label>
                {formRecognitionData.image && <img src={formRecognitionData.image} alt="Actual" className="h-20 mb-2 rounded object-cover" />}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleRecognitionFileChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required={!editingRecognitionId}
                />
              </div>

              <div className="col-span-2 flex gap-4 mt-4">
                <button
                  type="submit"
                  className="bg-[#1e3a8a] text-white px-6 py-2 rounded hover:bg-blue-900 transition font-bold"
                disabled={booksUploading}
                >
                  {recognitionsUploading ? "Guardando..." : (editingRecognitionId ? "Actualizar" : "Guardar")}
                </button>
                <button
                  type="button"
                  onClick={resetRecognitionForm}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition font-bold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- VISTA: LISTADO RECONOCIMIENTOS (TABLA) --- */}
        {activeTab === 'recognitions' && view === "list" && (
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
           {recognitionsLoading ? (
              <div className="p-12 text-center text-gray-500">Cargando reconocimientos...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 border-b border-gray-200 uppercase text-xs tracking-wider">
                      <th className="p-4">Imagen</th>
                      <th className="p-4">Título</th>
                      <th className="p-4">Otorgado por</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recognitions.map((rec) => (
                      <tr key={rec.id} className="hover:bg-gray-50 transition">
                        <td className="p-4">
                          <img src={rec.image} alt={rec.title} className="w-12 h-12 object-cover rounded shadow-sm" />
                        </td>
                        <td className="p-4 font-bold text-[#1e3a8a]">{rec.title}</td>
                        <td className="p-4 text-gray-600">{rec.issuer}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEditRecognition(rec)} className="text-blue-600 hover:bg-blue-50 p-2 rounded transition"><IconEdit /></button>
                            <button onClick={() => handleDeleteRecognition(rec.id)} className="text-red-600 hover:bg-red-50 p-2 rounded transition"><IconTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {recognitions.length === 0 && (
                      <tr><td colSpan="4" className="p-8 text-center text-gray-500">No hay reconocimientos registrados.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
           )}
         </div>
         )}

         {/* --- VISTA: LISTADO COMENTARIOS (TABLA) --- */}
         {activeTab === 'comments' && view === 'list' && (
           <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
             {commentsLoading ? (
               <div className="p-12 text-center text-gray-500">Cargando comentarios...</div>
             ) : (
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-gray-50 text-gray-700 border-b border-gray-200 uppercase text-xs tracking-wider">
                       <th className="p-4">Estado</th>
                       <th className="p-4">Autor</th>
                       <th className="p-4">Ubicación</th>
                       <th className="p-4">Mensaje</th>
                       <th className="p-4">Fecha</th>
                       <th className="p-4 text-center">Acciones</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {comments.map((comment) => (
                       <tr key={comment.id} className="hover:bg-gray-50 transition">
                         <td className="p-4">
                           {comment.is_approved ? (
                             <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                               <IconCheck /> Aprobado
                             </span>
                           ) : (
                             <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                               Pendiente
                             </span>
                           )}
                         </td>
                         <td className="p-4 font-bold text-[#1e3a8a]">
                           {comment.name || "Anónimo"}
                         </td>
                         <td className="p-4 text-gray-600 text-sm">
                           {comment.location || "-"}
                         </td>
                         <td className="p-4 text-gray-600 text-sm max-w-xs truncate">
                           {comment.message}
                         </td>
                         <td className="p-4 text-gray-500 text-sm whitespace-nowrap">
                           {comment.createdAt?.toDate?.().toLocaleDateString?.('es-AR', {
                             day: 'numeric',
                             month: 'short',
                             year: 'numeric'
                           }) || 'Fecha no disponible'}
                         </td>
                         <td className="p-4 text-center">
                           <div className="flex justify-center gap-2">
                             {!comment.is_approved && (
                               <button
                                 onClick={() => handleApproveComment(comment.id)}
                                 className="text-green-600 hover:bg-green-50 p-2 rounded transition"
                                 title="Aprobar"
                               >
                                 <IconCheck />
                               </button>
                             )}
                             <button
                               onClick={() => handleDeleteComment(comment.id)}
                               className="text-red-600 hover:bg-red-50 p-2 rounded transition"
                               title="Eliminar"
                             >
                               <IconTrash />
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                     {comments.length === 0 && (
                       <tr>
                         <td colSpan="6" className="p-8 text-center text-gray-500">
                           No hay comentarios registrados.
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
             )}
            </div>
          )}

          {/* --- VISTA: LISTADO BANNERS (TABLA) --- */}
          {activeTab === 'banners' && view === "list" && (
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              {bannersLoading ? (
                <div className="p-12 text-center text-gray-500">Cargando banners...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 border-b border-gray-200 uppercase text-xs tracking-wider">
                        <th className="p-4">Imagen</th>
                        <th className="p-4">Título</th>
                        <th className="p-4">Fecha del Evento</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {banners.map((banner) => (
                        <tr key={banner.id} className="hover:bg-gray-50 transition">
                          <td className="p-4">
                            <img src={banner.image} alt={banner.title} className="w-16 h-12 object-cover rounded shadow-sm" />
                          </td>
                          <td className="p-4 font-bold text-[#1e3a8a]">{banner.title}</td>
                          <td className="p-4 text-gray-600">
                            {banner.eventDate ? new Date(banner.eventDate).toLocaleDateString('es-AR') : 'Sin fecha'}
                          </td>
                          <td className="p-4 text-center">
                            {banner.isActive ? (
                              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">Activo</span>
                            ) : (
                              <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded-full">Inactivo</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditBanner(banner)}
                                className="text-blue-600 hover:bg-blue-50 p-2 rounded transition"
                                title="Editar"
                              >
                                <IconEdit />
                              </button>
                              <button
                                onClick={() => handleBannerDelete(banner.id)}
                                className="text-red-600 hover:bg-red-50 p-2 rounded transition"
                                title="Eliminar"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {banners.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-gray-500">
                            No hay banners registrados. ¡Agrega uno nuevo!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* --- VISTA: LISTADO EVENTOS (TABLA) --- */}
          {activeTab === 'events' && view === "list" && (
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              {eventsLoading ? (
                <div className="p-12 text-center text-gray-500">Cargando eventos...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 border-b border-gray-200 uppercase text-xs tracking-wider">
                        <th className="p-4">Imagen</th>
                        <th className="p-4">Título</th>
                        <th className="p-4">Epígrafe</th>
                        <th className="p-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {events.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50 transition">
                          <td className="p-4">
                            <img src={event.image} alt={event.title} className="w-16 h-12 object-cover rounded shadow-sm" />
                          </td>
                          <td className="p-4 font-bold text-[#1e3a8a]">{event.title}</td>
                          <td className="p-4 text-gray-600 italic">{event.epigraph || "-"}</td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditEvent(event)}
                                className="text-blue-600 hover:bg-blue-50 p-2 rounded transition"
                                title="Editar"
                              >
                                <IconEdit />
                              </button>
                              <button
                                onClick={() => handleEventDelete(event.id)}
                                className="text-red-600 hover:bg-red-50 p-2 rounded transition"
                                title="Eliminar"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {events.length === 0 && (
                        <tr>
                          <td colSpan="4" className="p-8 text-center text-gray-500">
                            No hay eventos registrados. ¡Agrega uno nuevo!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* --- VISTA: LISTADO BLOG (TABLA) --- */}
          {activeTab === 'blog' && view === "list" && (
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              {blogLoading ? (
                <div className="p-12 text-center text-gray-500">Cargando entradas del blog...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 border-b border-gray-200 uppercase text-xs tracking-wider">
                        <th className="p-4">Imagen</th>
                        <th className="p-4">Título</th>
                        <th className="p-4">Categoría</th>
                        <th className="p-4">Fecha</th>
                        <th className="p-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {blogPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50 transition">
                          <td className="p-4">
                            <img src={post.image} alt={post.title} className="w-16 h-12 object-cover rounded shadow-sm" />
                          </td>
                          <td className="p-4 font-bold text-[#1e3a8a]">{post.title}</td>
                          <td className="p-4 text-gray-600 capitalize">{post.category || "Sin categoría"}</td>
                          <td className="p-4 text-gray-600 text-sm">
                            {post.createdAt?.toDate?.().toLocaleDateString('es-AR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) || 'Sin fecha'}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditBlog(post)}
                                className="text-blue-600 hover:bg-blue-50 p-2 rounded transition"
                                title="Editar"
                              >
                                <IconEdit />
                              </button>
                              <button
                                onClick={() => handleBlogDelete(post.id)}
                                className="text-red-600 hover:bg-red-50 p-2 rounded transition"
                                title="Eliminar"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {blogPosts.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-gray-500">
                            No hay entradas del blog. ¡Crea la primera!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
    </div>
     </>
   );
 }
