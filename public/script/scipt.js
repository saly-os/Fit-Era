// 1. Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAenWIP-paGbvugvr39gOKeYsqGhPQxf2o",
    authDomain: "new-gains-tracker.firebaseapp.com",
    projectId: "new-gains-tracker",
    storageBucket: "new-gains-tracker.firebasestorage.app",
    messagingSenderId: "459556173331",
    appId: "1:459556173331:web:0894ade4f3d949462af1e6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. Handle Form Submit
document.getElementById("daily-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    date: document.getElementById("date").value,
    water: document.getElementById("water").value,
    sleep: document.getElementById("sleep").value,
    breakfast: document.getElementById("breakfast").value,
    // Add more fields as needed
  };

  try {
    await addDoc(collection(db, "dailyEntries"), data);
    alert("✅ Data saved!");
  } catch (err) {
    console.error("Error saving doc: ", err);
    alert("❌ Something went wrong");
  }
});