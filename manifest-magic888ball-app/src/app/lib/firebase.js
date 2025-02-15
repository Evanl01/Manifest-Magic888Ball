// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
const db = getFirestore(app);

// Function to add an entry to Firestore
export const addEntry = async (question, response) => {
    try {
        console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY); // Check if it's printing correctly

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
