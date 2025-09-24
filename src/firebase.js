import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

/**
 * Use variáveis Vite (prefixo VITE_) no .env:
 * VITE_FIREBASE_API_KEY=...
 * VITE_FIREBASE_AUTH_DOMAIN=...
 * VITE_FIREBASE_PROJECT_ID=...
 * VITE_FIREBASE_STORAGE_BUCKET=...
 * VITE_FIREBASE_MESSAGING_SENDER_ID=...
 * VITE_FIREBASE_APP_ID=...
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAostvdG27uYLmXP9aeQrzoK1P3VXKD2lQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dsplancar.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dsplancar",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dsplancar.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "813245706461",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:813245706461:web:dd947e7e3b0a79f46a2b34",
};

// Evita re-inicializar no HMR do Vite
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
