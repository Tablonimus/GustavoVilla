import { useState, useCallback, useMemo } from "react";
import { db, storage } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const useBlog = () => {
  const blogCollectionRef = useMemo(() => collection(db, "blog"), []);

  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchBlogPosts = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(blogCollectionRef, orderBy("createdAt", "desc"));
      const data = await getDocs(q);
      setBlogPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
    setLoading(false);
  }, [blogCollectionRef]);

  const handleSubmit = useCallback(async (formData, imageFile, editingId) => {
    setUploading(true);

    try {
      let imageUrl = formData.image;

      // Subir imagen si se seleccionó una nueva
      if (imageFile) {
        const imageRef = ref(storage, `blog/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const dataToSave = {
        ...formData,
        image: imageUrl,
        author: "Gustavo Villa",
        createdAt: editingId ? formData.createdAt : new Date()
      };

      if (editingId) {
        // Actualizar existente
        const blogDoc = doc(db, "blog", editingId);
        await updateDoc(blogDoc, dataToSave);
        alert("Entrada del blog actualizada correctamente");
      } else {
        // Crear nuevo
        await addDoc(blogCollectionRef, dataToSave);
        alert("Entrada del blog creada correctamente");
      }

      // Resetear y volver a la lista
      fetchBlogPosts();
    } catch (error) {
      console.error("Error saving blog post:", error);
      alert("Error al guardar la entrada del blog");
    } finally {
      setUploading(false);
    }
  }, [blogCollectionRef, fetchBlogPosts]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm("¿Estás seguro de querer eliminar esta entrada del blog?")) {
      try {
        const blogDoc = doc(db, "blog", id);
        await deleteDoc(blogDoc);
        fetchBlogPosts();
      } catch (error) {
        console.error("Error deleting blog post:", error);
      }
    }
  }, [fetchBlogPosts]);

  return {
    blogPosts,
    loading,
    uploading,
    fetchBlogPosts,
    handleSubmit,
    handleDelete,
  };
};