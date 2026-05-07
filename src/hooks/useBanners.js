import { useState, useCallback, useMemo } from "react";
import { db, storage } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const useBanners = () => {
  const bannersCollectionRef = useMemo(() => collection(db, "banners"), []);

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDocs(bannersCollectionRef);
      setBanners(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
    setLoading(false);
  }, [bannersCollectionRef]);

  const handleSubmit = useCallback(async (formData, imageFile, editingId) => {
    setUploading(true);

    try {
      let imageUrl = formData.image;

      // Subir imagen si se seleccionó una nueva
      if (imageFile) {
        const imageRef = ref(storage, `banners/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const dataToSave = { ...formData, image: imageUrl };

      if (editingId) {
        // Actualizar existente
        const bannerDoc = doc(db, "banners", editingId);
        await updateDoc(bannerDoc, dataToSave);
        alert("Banner actualizado correctamente");
      } else {
        // Crear nuevo
        await addDoc(bannersCollectionRef, dataToSave);
        alert("Banner creado correctamente");
      }

      // Resetear y volver a la lista
      fetchBanners();
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("Error al guardar el banner");
    } finally {
      setUploading(false);
    }
  }, [bannersCollectionRef, fetchBanners]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm("¿Estás seguro de querer eliminar este banner?")) {
      try {
        const bannerDoc = doc(db, "banners", id);
        await deleteDoc(bannerDoc);
        fetchBanners();
      } catch (error) {
        console.error("Error deleting banner:", error);
      }
    }
  }, [fetchBanners]);

  return {
    banners,
    loading,
    uploading,
    fetchBanners,
    handleSubmit,
    handleDelete,
  };
};