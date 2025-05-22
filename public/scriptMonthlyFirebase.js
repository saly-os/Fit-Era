// --- Initialisation Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyApHKktjUp1693l2WrODGM8WVf1zsb_4Co",
  authDomain: "fit-journey-c9595.firebaseapp.com",
  projectId: "fit-journey-c9595",
  storageBucket: "fit-journey-c9595.firebasestorage.app",
  messagingSenderId: "743314539613",
  appId: "1:743314539613:web:09a5a6d17bea2375a1b9b4"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

// Authentification
auth.onAuthStateChanged((user) => {
  currentUser = user;
  if (user) {
    document.getElementById('monthly-message').innerText = "Connectée en tant que " + (user.email || "");
    loadMonthlyEntries();
  } else {
    document.getElementById('monthly-message').innerText = "⚠️ Connecte-toi pour voir et enregistrer ton suivi mensuel.";
    document.getElementById('monthly-table-body').innerHTML = "";
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('monthly-form').addEventListener('submit', saveMonthlyEntry);
});

// Sauvegarder une entrée
async function saveMonthlyEntry(e) {
  e.preventDefault();
  if (!currentUser) {
    alert("Tu dois être connectée pour enregistrer.");
    return;
  }
  const data = {
    date: document.getElementById("month-date").value,
    poids: document.getElementById("month-poids").value,
    taille: document.getElementById("month-taille").value,
    eau: document.getElementById("month-eau").value,
    workout: document.getElementById("month-workout").value,
    bilan: document.getElementById("month-bilan").value,
    userId: currentUser.uid
  };
  try {
    // Unicité par mois+user : remplace si existe déjà
    const ref = db.collection("monthlyEntries");
    const existing = await ref.where("userId", "==", currentUser.uid).where("date", "==", data.date).get();
    if (!existing.empty) {
      existing.forEach(doc => doc.ref.delete());
    }
    await ref.add(data);
    document.getElementById('monthly-message').innerText = "✅ Entrée sauvegardée !";
    e.target.reset();
    loadMonthlyEntries();
  } catch (err) {
    document.getElementById('monthly-message').innerText = "❌ Erreur : " + err.message;
  }
}

// Charger les entrées
async function loadMonthlyEntries() {
  if (!currentUser) return;
  const ref = db.collection("monthlyEntries");
  const snapshot = await ref.where("userId", "==", currentUser.uid).orderBy("date", "desc").get();
  const tbody = document.getElementById("monthly-table-body");
  tbody.innerHTML = "";
  snapshot.forEach(doc => {
    renderMonthlyEntry(doc.data(), doc.id);
  });
}

// Afficher une entrée
function renderMonthlyEntry(data, docId) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${data.date}</td>
    <td>${data.poids}</td>
    <td>${data.taille}</td>
    <td>${data.eau}</td>
    <td>${data.workout}</td>
    <td>${data.bilan}</td>
    <td><button class="delete-btn">🗑</button></td>
  `;
  row.querySelector('.delete-btn').addEventListener('click', () => {
    deleteMonthlyEntry(docId);
  });
  document.getElementById("monthly-table-body").appendChild(row);
}

// Supprimer une entrée
async function deleteMonthlyEntry(docId) {
  if (!confirm("Supprimer cette entrée ?")) return;
  try {
    await db.collection("monthlyEntries").doc(docId).delete();
    loadMonthlyEntries();
  } catch (err) {
    alert("Erreur lors de la suppression : " + err.message);
  }
}