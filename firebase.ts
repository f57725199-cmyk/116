
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyC7N3IOa7GRETNRBo8P-QKVFzg2bLqoEco",
  authDomain: "students-app-deae5.firebaseapp.com",
  databaseURL: "https://students-app-deae5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "students-app-deae5",
  storageBucket: "students-app-deae5.firebasestorage.app",
  messagingSenderId: "128267767708",
  appId: "1:128267767708:web:08ed73b1563b2f3eb60259"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const getUserProgress = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId.toLowerCase().trim());
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const saveUserProgress = async (userId: string, data: any) => {
  try {
    const docRef = doc(db, "users", userId.toLowerCase().trim());
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error("Error saving to Firestore:", error);
  }
};
