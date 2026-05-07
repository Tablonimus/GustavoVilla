import { useState, useCallback, useMemo } from "react";
import { db, storage } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const useEvents = () => {
  const eventsCollectionRef = useMemo(() => collection(db, "events"), []);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(eventsCollectionRef, orderBy("createdAt", "desc"));
      const data = await getDocs(q);
      setEvents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching events:", error);
    }
    setLoading(false);
  }, [eventsCollectionRef]);

  const handleSubmit = useCallback(async (formData, imageFile, editingId) => {
    setUploading(true);

    try {
      let imageUrl = formData.image;

      // Subir imagen si se seleccionó una nueva
      if (imageFile) {
        const imageRef = ref(storage, `events/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const dataToSave = {
        ...formData,
        image: imageUrl,
        createdAt: new Date()
      };

      if (editingId) {
        // Actualizar existente
        const eventDoc = doc(db, "events", editingId);
        await updateDoc(eventDoc, dataToSave);
        alert("Evento actualizado correctamente");
      } else {
        // Crear nuevo
        await addDoc(eventsCollectionRef, dataToSave);
        alert("Evento creado correctamente");
      }

      // Resetear y volver a la lista
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Error al guardar el evento");
    } finally {
      setUploading(false);
    }
  }, [eventsCollectionRef, fetchEvents]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm("¿Estás seguro de querer eliminar este evento?")) {
      try {
        const eventDoc = doc(db, "events", id);
        await deleteDoc(eventDoc);
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  }, [fetchEvents]);

  return {
    events,
    loading,
    uploading,
    fetchEvents,
    handleSubmit,
    handleDelete,
  };
};