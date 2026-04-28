import { useState, useCallback, useMemo } from "react";
import { db, storage } from "../../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const useRecognitions = () => {
  const recognitionsCollectionRef = useMemo(() => collection(db, "recognitions"), []);

  const [recognitions, setRecognitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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

  const handleSaveRecognition = useCallback(async (formRecognitionData, recognitionImageFile, editingRecognitionId) => {
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
      fetchRecognitions();
    } catch (error) {
      console.error("Error saving recognition:", error);
      alert("Error al guardar el reconocimiento");
    } finally {
      setUploading(false);
    }
  }, [recognitionsCollectionRef, fetchRecognitions]);

  const handleDeleteRecognition = useCallback(async (id) => {
    if (window.confirm("¿Estás seguro de querer eliminar este reconocimiento?")) {
      try {
        await deleteDoc(doc(db, "recognitions", id));
        fetchRecognitions();
      } catch (error) {
        console.error("Error deleting recognition:", error);
      }
    }
  }, [fetchRecognitions]);

  return {
    recognitions,
    loading,
    uploading,
    fetchRecognitions,
    handleSaveRecognition,
    handleDeleteRecognition,
  };
};