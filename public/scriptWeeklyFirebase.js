// --- Initialisation Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyAenWIP-paGbvugvr39gOKeYsqGhPQxf2o",
  authDomain: "new-gains-tracker.firebaseapp.com",
  projectId: "new-gains-tracker",
  storageBucket: "new-gains-tracker.appspot.com",
  messagingSenderId: "459556173331",
  appId: "1:459556173331:web:0894ade4f3d949462af1e6"
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
    document.getElementById('weekly-message').innerText = "Connectée en tant que " + (user.email || "");
    loadWeeklyEntries();
  } else {
    document.getElementById('weekly-message').innerText = "⚠️ Connecte-toi pour voir et enregistrer ton suivi hebdomadaire.";
    document.getElementById('weekly-table-body').innerHTML = "";
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('weekly-form').addEventListener('submit', saveWeeklyEntry);
});

// Sauvegarder une entrée
async function saveWeeklyEntry(e) {
  e.preventDefault();
  if (!currentUser) {
    alert("Tu dois être connectée pour enregistrer.");
    return;
  }
  const data = {
    date: document.getElementById("week-date").value,
    poids: document.getElementById("week-poids").value,
    eau: document.getElementById("week-eau").value,
    workout: document.getElementById("week-workout").value,
    ressenti: document.getElementById("week-ressenti").value,
    userId: currentUser.uid
  };
  try {
    // Unicité par semaine+user : remplace si existe déjà
    const ref = db.collection("weeklyEntries");
    const existing = await ref.where("userId", "==", currentUser.uid).where("date", "==", data.date).get();
    if (!existing.empty) {
      existing.forEach(doc => doc.ref.delete());
    }
    await ref.add(data);
    document.getElementById('weekly-message').innerText = "✅ Entrée sauvegardée !";
    e.target.reset();
    loadWeeklyEntries();
  } catch (err) {
    document.getElementById('weekly-message').innerText = "❌ Erreur : " + err.message;
  }
}

// Charger les entrées
async function loadWeeklyEntries() {
  if (!currentUser) return;
  const ref = db.collection("weeklyEntries");
  const snapshot = await ref.where("userId", "==", currentUser.uid).orderBy("date", "desc").get();
  const tbody = document.getElementById("weekly-table-body");
  tbody.innerHTML = "";
  snapshot.forEach(doc => {
    renderWeeklyEntry(doc.data(), doc.id);
  });
}

// Afficher une entrée
function renderWeeklyEntry(data, docId) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${data.date}</td>
    <td>${data.poids}</td>
    <td>${data.eau}</td>
    <td>${data.workout}</td>
    <td>${data.ressenti}</td>
    <td><button class="delete-btn">🗑</button></td>
  `;
  row.querySelector('.delete-btn').addEventListener('click', () => {
    deleteWeeklyEntry(docId);
  });
  document.getElementById("weekly-table-body").appendChild(row);
}

// Supprimer une entrée
async function deleteWeeklyEntry(docId) {
  if (!confirm("Supprimer cette entrée ?")) return;
  try {
    await db.collection("weeklyEntries").doc(docId).delete();
    loadWeeklyEntries();
  } catch (err) {
    alert("Erreur lors de la suppression : " + err.message);
  }
}