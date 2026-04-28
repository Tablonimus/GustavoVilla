import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --- PASO 1: Configuración ---
// Coloca el archivo JSON de tu clave de cuenta de servicio en la raíz del proyecto
// y renómbralo a "serviceAccountKey.json".
// ¡¡IMPORTANTE!! Asegúrate de agregar "serviceAccountKey.json" a tu archivo .gitignore.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(path.join(__dirname, "serviceAccountKey.json"), "utf8")
);

// --- PASO 2: Inicialización de Firebase ---
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Ruta al archivo JSON con los datos de los libros
const jsonFilePath = path.join(__dirname, "public", "data", "books.json");
const booksData = JSON.parse(readFileSync(jsonFilePath, "utf8"));


const uploadBooks = async () => {
  const booksCollection = db.collection("books");
  console.log("Iniciando la carga de libros a Firestore...");

  for (const book of booksData) {
    const bookToUpload = { ...book };
    delete bookToUpload.id; // Quitamos el ID numérico del JSON
    await booksCollection.add(bookToUpload);
    console.log(`✅ Libro agregado: "${book.title}"`);
  }

  console.log("\n🎉 Proceso de carga finalizado.");
};

uploadBooks().catch(console.error);