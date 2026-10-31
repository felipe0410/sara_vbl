import { getApp, getApps, initializeApp } from "firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import { Firestore, connectFirestoreEmulator, getFirestore } from "firebase/firestore/lite";

// Configuración pública de la app web (no es secreta: la protección está en las reglas de Firestore).
const config = {
  apiKey: "AIzaSyCQGvzvf8tTk9KN_3woaY7tkYLVLjJcC_k",
  authDomain: "sara-balaguera.firebaseapp.com",
  projectId: "sara-balaguera",
  storageBucket: "sara-balaguera.firebasestorage.app",
  messagingSenderId: "974825495614",
  appId: "1:974825495614:web:ad5584f3cb5e7cb648456f",
};

// NEXT_PUBLIC_EMULADOR=1 al compilar → usa los emuladores locales (pruebas sin tocar producción).
const EMULADOR = process.env.NEXT_PUBLIC_EMULADOR === "1";

export function app() {
  return getApps().length ? getApp() : initializeApp(config);
}

let _db: Firestore | undefined;
let _auth: Auth | undefined;

export function db() {
  if (!_db) {
    _db = getFirestore(app());
    if (EMULADOR) connectFirestoreEmulator(_db, "127.0.0.1", 8080);
  }
  return _db;
}

export function auth() {
  if (!_auth) {
    _auth = getAuth(app());
    if (EMULADOR) connectAuthEmulator(_auth, "http://127.0.0.1:9099", { disableWarnings: true });
  }
  return _auth;
}
