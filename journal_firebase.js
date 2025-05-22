// --- Initialisation Firebase (évite double init si déjà fait ailleurs) ---
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
    document.getElementById('journal-message').innerText = "Connectée en tant que " + (user.email || "");
    loadJournalEntries();
  } else {
    document.getElementById('journal-message').innerText = "⚠️ Connecte-toi pour voir et écrire dans ton journal.";
    document.getElementById('journal-output').innerHTML = "";
  }
});

// Gestion du formulaire
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('journal-form').addEventListener('submit', saveJournalEntry);
});

// Sauvegarder une entrée dans Firestore
async function saveJournalEntry(e) {
  e.preventDefault();
  if (!currentUser) {
    alert("Tu dois être connectée pour enregistrer.");
    return;
  }
  const text = document.getElementById('journal-entry').value.trim();
  const date = new Date().toLocaleString('fr-FR');
  if (!text) return;
  try {
    await db.collection("journalEntries").add({
      userId: currentUser.uid,
      date,
      text
    });
    document.getElementById('journal-message').innerText = "✅ Journal sauvegardé !";
    e.target.reset();
    loadJournalEntries();
  } catch (err) {
    document.getElementById('journal-message').innerText = "❌ Erreur : " + err.message;
  }
}

// Charger les entrées de l'utilisateur
async function loadJournalEntries() {
  if (!currentUser) return;
  const ref = db.collection("journalEntries");
  const snapshot = await ref.where("userId", "==", currentUser.uid).orderBy("date", "desc").get();
  const container = document.getElementById('journal-output');
  container.innerHTML = "";
  snapshot.forEach(doc => {
    renderJournalEntry(doc.data(), doc.id);
  });
}

// Afficher une entrée
function renderJournalEntry(data, docId) {
  const entry = document.createElement("div");
  entry.classList.add("journal-entry");
  entry.innerHTML = `
    <p><strong>${data.date}</strong> : ${data.text}</p>
    <button class="delete-btn">🗑 Supprimer</button>
    <hr>
  `;
  entry.querySelector('.delete-btn').addEventListener('click', () => {
    deleteJournalEntry(docId);
  });
  document.getElementById("journal-output").appendChild(entry);
}

// Supprimer une entrée
async function deleteJournalEntry(docId) {
  if (!confirm("Supprimer cette entrée ?")) return;
  try {
    await db.collection("journalEntries").doc(docId).delete();
    loadJournalEntries();
  } catch (err) {
    alert("Erreur lors de la suppression : " + err.message);
  }
}