import { useState, useCallback, useMemo } from "react";
import { db, storage } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const useBooks = () => {
  const booksCollectionRef = useMemo(() => collection(db, "books"), []);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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

  const handleSubmit = useCallback(async (formData, imageFile, fullImageFile, editingId) => {
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
      } else {
        // Crear nuevo
        await addDoc(booksCollectionRef, dataToSave);
        alert("Libro creado correctamente");
      }

      // Resetear y volver a la lista
      fetchBooks();
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Error al guardar el libro");
    } finally {
      setUploading(false);
    }
  }, [booksCollectionRef, fetchBooks]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm("¿Estás seguro de querer eliminar este libro?")) {
      try {
        const bookDoc = doc(db, "books", id);
        await deleteDoc(bookDoc);
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  }, [fetchBooks]);

  return {
    books,
    loading,
    uploading,
    fetchBooks,
    handleSubmit,
    handleDelete,
  };
};