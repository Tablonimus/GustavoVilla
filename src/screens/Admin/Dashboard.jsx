import { useState, useEffect, useCallback, useMemo } from "react";
import { db, storage } from "../../../firebase"; // Importamos storage
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);

export default function AdminBooks() {
  // --- ESTADOS DE NAVEGACIÓN ---
  const [activeTab, setActiveTab] = useState("books"); // 'books', 'settings', etc.
  const [view, setView] = useState("list"); // 'list' | 'form'

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // --- ESTADOS DE DATOS ---
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // Estado para la carga de imágenes
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Archivo de portada
  const [fullImageFile, setFullImageFile] = useState(null); // Archivo de fondo
  const [recognitionImageFile, setRecognitionImageFile] = useState(null); // Archivo de reconocimiento

  const [recognitions, setRecognitions] = useState([]);
  const [editingRecognitionId, setEditingRecognitionId] = useState(null)

  // Estado inicial del formulario limpio
  const initialFormState = {
    title: "",
    description: "",
    full_description: "",
    image: "",
    full_image: "",
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

  const booksCollectionRef = useMemo(() => collection(db, "books"), []);
  const recognitionsCollectionRef = useMemo(() => collection(db, "recognitions"), []);

  // --- LEER (Read) ---
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDocs(booksCollectionRef);
      setBooks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching books:", error);
    }
    setLoading(false);
  }, [booksCollectionRef]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

    // --- RECONOCIMIENTOS: LEER (Read) ---
    const fetchRecognitions = useCallback(async () => {
      setLoading(true);
      try {
        const data = await getDocs(recognitionsCollectionRef);
        setRecognitions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error fetching recognitions:", error);
      }
      setLoading(false);
    }, [recognitionsCollectionRef]);
  


  // --- CREAR (Create) y ACTUALIZAR (Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image;
      let fullImageUrl = formData.full_image;

      // 1. Subir imagen de portada si se seleccionó una nueva
      if (imageFile) {
        const imageRef = ref(storage, `book_covers/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. Subir imagen completa si se seleccionó una nueva
      if (fullImageFile) {
        const fullImageRef = ref(storage, `book_full/${Date.now()}_${fullImageFile.name}`);
        const snapshot = await uploadBytes(fullImageRef, fullImageFile);
        fullImageUrl = await getDownloadURL(snapshot.ref);
      }

      const dataToSave = { ...formData, image: imageUrl, full_image: fullImageUrl };

      if (editingId) {
        // Actualizar existente
        const bookDoc = doc(db, "books", editingId);
        await updateDoc(bookDoc, dataToSave);
        alert("Libro actualizado correctamente");
        setEditingId(null);
      } else {
        // Crear nuevo
        await addDoc(booksCollectionRef, dataToSave);
        alert("Libro creado correctamente");
      }
      
      // Resetear y volver a la lista
      resetForm();
      fetchBooks();
      setView("list");
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Error al guardar el libro");
    } finally {
      setUploading(false);
    }
  };

  // --- BORRAR (Delete) ---
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de querer eliminar este libro?")) {
      try {
        const bookDoc = doc(db, "books", id);
        await deleteDoc(bookDoc);
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  // Cargar datos en el formulario para editar
  const handleEdit = (book) => {
    setEditingId(book.id);
    setFormData(book);
    setImageFile(null);
    setFullImageFile(null);
    setView("form"); // Cambiar a vista de formulario
  };

  // --- RECONOCIMIENTOS: FUNCIONES CRUD ---
  const handleSaveRecognition = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = formRecognitionData.image;
      
      // Subir imagen si existe nueva
      if (recognitionImageFile) {
        const imageRef = ref(storage, `recognition_covers/${Date.now()}_${recognitionImageFile.name}`);
        const snapshot = await uploadBytes(imageRef, recognitionImageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const dataToSave = { ...formRecognitionData, image: imageUrl };

      if (editingRecognitionId) {
        const docRef = doc(db, "recognitions", editingRecognitionId);
        await updateDoc(docRef, dataToSave);
        alert("Reconocimiento actualizado correctamente");
      } else {
        await addDoc(recognitionsCollectionRef, dataToSave);
        alert("Reconocimiento creado correctamente");
      }
      resetRecognitionForm();
      fetchRecognitions();
    } catch (error) {
      console.error("Error saving recognition:", error);
      alert("Error al guardar el reconocimiento");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRecognition = async (id) => {
    if (window.confirm("¿Estás seguro de querer eliminar este reconocimiento?")) {
      try {
        await deleteDoc(doc(db, "recognitions", id));
        fetchRecognitions();
      } catch (error) {
        console.error("Error deleting recognition:", error);
      }
    }
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

  useEffect(() => {
    if (activeTab === 'recognitions') {
      fetchRecognitions();
    }
  }, [activeTab, fetchRecognitions]);




  // --- RENDERIZADO ---
  return (
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
              {activeTab === 'books' ? "Gestión de Libros" : "Gestión de Reconocimientos"}
            </h1>
            <p className="text-gray-500">
              {activeTab === 'books' ? "Administra el catálogo de obras literarias." : "Administra los premios y menciones recibidos."}
            </p>
          </div>
          {view === "list" && (
            <button 
              onClick={() => { 
                if (activeTab === 'books') resetForm(); 
                else resetRecognitionForm();
                setView("form"); 
              }}
              className="bg-[#774936] text-white px-4 py-2 rounded shadow hover:bg-[#5d3a2a] transition flex items-center gap-2"
            >
              <IconPlus /> {activeTab === 'books' ? "Nuevo Libro" : "Nuevo Reconocimiento"}
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

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                disabled={uploading}
              >
                {uploading ? "Subiendo..." : (editingId ? "Actualizar Libro" : "Guardar Libro")}
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

        {/* --- VISTA: LISTADO LIBROS (TABLA) --- */}
        {activeTab === 'books' && view === "list" && (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          {loading ? (
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
                            onClick={() => handleDelete(book.id)}
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

            <form onSubmit={handleSaveRecognition} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  disabled={uploading}
                >
                  {uploading ? "Guardando..." : (editingRecognitionId ? "Actualizar" : "Guardar")}
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
            {loading ? (
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

      </main>
    </div>
  );
}
