// --- Initialisation Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyApHKktjUp1693l2WrODGM8WVf1zsb_4Co",
  authDomain: "fit-journey-c9595.firebaseapp.com",
  projectId: "fit-journey-c9595",
  storageBucket: "fit-journey-c9595.firebasestorage.app",
  messagingSenderId: "743314539613",
  appId: "1:743314539613:web:09a5a6d17bea2375a1b9b4"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

// Vérifier la connexion de l'utilisateur
auth.onAuthStateChanged((user) => {
  currentUser = user;
  if (user) {
    document.getElementById('firebase-message').innerText = "Connectée en tant que " + (user.email || "");
    loadDailyEntries();
  } else {
    document.getElementById('firebase-message').innerText = "⚠️ Connecte-toi pour voir et enregistrer tes suivis.";
    document.getElementById('daily-results').innerHTML = "";
  }
});

// Gestion du formulaire
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('daily-form').addEventListener('submit', saveDailyFirebase);
  document.getElementById('pdf-btn').addEventListener('click', generatePDF);
});

// Sauvegarder une entrée dans Firestore
async function saveDailyFirebase(e) {
  e.preventDefault();
  if (!currentUser) {
    alert("Tu dois être connectée pour enregistrer.");
    return;
  }
  const data = {
    date: document.getElementById('date').value,
    poids: document.getElementById('poids').value,
    taille: document.getElementById('taille').value,
    eau: document.getElementById('eau').value,
    workout: document.getElementById('workout').value,
    breakfast: document.getElementById('breakfast').value,
    lunch: document.getElementById('lunch').value,
    dinner: document.getElementById('dinner').value,
    snack1: document.getElementById('snack1').value,
    snack2: document.getElementById('snack2').value,
    foodNotes: document.getElementById('food-notes').value,
    userId: currentUser.uid
  };
  try {
    // Unicité par date+user : remplace si existe déjà
    const ref = db.collection("dailyEntries");
    const existing = await ref.where("userId", "==", currentUser.uid).where("date", "==", data.date).get();
    if (!existing.empty) {
      // Supprime l'existant
      existing.forEach(doc => doc.ref.delete());
    }
    await ref.add(data);
    document.getElementById('firebase-message').innerText = "✅ Données sauvegardées dans le cloud !";
    e.target.reset();
    loadDailyEntries();
  } catch (err) {
    document.getElementById('firebase-message').innerText = "❌ Erreur lors de la sauvegarde : " + err.message;
  }
}

// Charger les entrées de l'utilisateur depuis Firestore
async function loadDailyEntries() {
  if (!currentUser) return;
  const ref = db.collection("dailyEntries");
  const snapshot = await ref.where("userId", "==", currentUser.uid).orderBy("date", "desc").get();
  const container = document.getElementById('daily-results');
  container.innerHTML = "";
  snapshot.forEach(doc => {
    renderEntry(doc.data(), doc.id);
  });
}

// Afficher une entrée
function renderEntry(data, docId) {
  const { date, poids, taille, eau, workout, breakfast, lunch, dinner, snack1, snack2, foodNotes } = data;
  const entry = document.createElement("div");
  entry.classList.add("daily-entry");
  entry.innerHTML = `
    <h4>📆 ${date}</h4>
    <p><strong>Poids:</strong> ${poids}kg • <strong>Taille:</strong> ${taille}cm • <strong>Eau:</strong> ${eau}L • <strong>Workout:</strong> ${workout}</p>
    <p><strong>🍳 Petit-déj:</strong> ${breakfast || "—"}<br>
       <strong>🥪 Déjeuner:</strong> ${lunch || "—"}<br>
       <strong>🍲 Dîner:</strong> ${dinner || "—"}<br>
       <strong>🍓 Snack 1:</strong> ${snack1 || "—"}<br>
       <strong>🍫 Snack 2:</strong> ${snack2 || "—"}</p>
    ${foodNotes ? `<p><strong>📝 Remarques:</strong> ${foodNotes}</p>` : ""}
    <button class="delete-btn">🗑 Supprimer</button>
    <hr>
  `;
  entry.querySelector('.delete-btn').addEventListener('click', () => {
    deleteEntryFirebase(docId);
  });
  document.getElementById("daily-results").appendChild(entry);
}

// Supprimer une entrée depuis Firestore
async function deleteEntryFirebase(docId) {
  if (!confirm("Supprimer cette entrée ?")) return;
  try {
    await db.collection("dailyEntries").doc(docId).delete();
    loadDailyEntries();
  } catch (err) {
    alert("Erreur lors de la suppression : " + err.message);
  }
}

// Générer un PDF de toutes les entrées affichées
function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const entries = document.querySelectorAll(".daily-entry");
  if (entries.length === 0) {
    alert("Tu n’as rien enregistré à imprimer.");
    return;
  }
  let y = 10;
  entries.forEach(entry => {
    const lines = doc.splitTextToSize(entry.innerText, 180);
    doc.text(lines, 15, y);
    y += lines.length * 10;
    if (y > 270) { doc.addPage(); y = 10; }
  });
  doc.save("Mon_Suivi_Journalier.pdf");
}