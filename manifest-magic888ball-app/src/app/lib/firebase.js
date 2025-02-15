// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaI_dxhP03X7r-STXZGDILyjIrC5oBKKY",
  authDomain: "manifest-magic.firebaseapp.com",
  projectId: "manifest-magic",
  storageBucket: "manifest-magic.appspot.com",
  messagingSenderId: "695559784271",
  appId: "1:695559784271:web:e7f1a0ebd8ed40b954a73a"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
const db = getFirestore(app);

// Function to add an entry to Firestore
export const addEntry = async (question, response) => {
  try {
    await addDoc(collection(db, "entries"), {
      question,
      response,
      date: serverTimestamp(), // Automatically store timestamp
    });
    console.log("Entry added successfully!");
  } catch (error) {
    console.error("Error adding entry:", error);
  }
};

// Function to get all entries from Firestore
export const getEntries = async () => {
  const querySnapshot = await getDocs(collection(db, "entries"));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export { db };
