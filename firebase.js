// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Importar Firestore
import { getStorage } from "firebase/storage"; // Importar Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgYk4aZLyMa2tpsVP0_3O5XAAIHPDsEaE",
  authDomain: "gustavo-villa.firebaseapp.com",
  projectId: "gustavo-villa",
  storageBucket: "gustavo-villa.firebasestorage.app",
  messagingSenderId: "785215548771",
  appId: "1:785215548771:web:fd3271933e5146dbe87756",
  measurementId: "G-Z3JE0GTGXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app); // Exportar la instancia de la base de datos
export const storage = getStorage(app); // Exportar Storage
