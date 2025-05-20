function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      document.getElementById("auth-message").innerText = "🎉 Compte créé avec succès !";
    })
    .catch((error) => {
      document.getElementById("auth-message").innerText = error.message;
    });
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      document.getElementById("auth-message").innerText = "👑 Connexion réussie, Queen !";
    })
    .catch((error) => {
      document.getElementById("auth-message").innerText = error.message;
    });
}
function logout() {
  firebase.auth().signOut()
    .then(() => {
      document.getElementById("auth-message").innerText = "👋 Déconnexion réussie !";
    })
    .catch((error) => {
      document.getElementById("auth-message").innerText = error.message;
    });
}
// 0. Initialisation de Firebase
// 1. Charger les entrées sauvegardées
function loadDaily() {
  const saved = JSON.parse(localStorage.getItem('dailyEntries') || '[]');
  saved.forEach(data => renderEntry(data));
}
document.addEventListener('DOMContentLoaded', loadDaily);

// 2. Affichage d’une entrée
function renderEntry(data) {
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
    ${foodNotes ? <p><strong>📝 Remarques:</strong> ${foodNotes}</p> : ""}
    <button class="delete-btn">🗑 Supprimer</button>
    <hr>
  `;
  entry.querySelector('.delete-btn').addEventListener('click', () => {
    entry.remove();
    deleteEntry(data.date);
  });
  document.getElementById("daily-results").appendChild(entry);
}

// 3. Sauvegarder une nouvelle entrée
function saveDaily(e) {
  e.preventDefault();
  const user = firebase.auth().currentUser;
  if (!user) {
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
    foodNotes: document.getElementById('food-notes').value
  };

  firebase.database().ref(`users/${user.uid}/entries`).push(data)
    .then(() => {
      alert("Données sauvegardées dans le cloud ✅");
      e.target.reset();
    })
    .catch((error) => {
      alert("Erreur Firebase : " + error.message);
    });
}

// 4. Supprimer du storage
function deleteEntry(dateToDelete) {
  const saved = JSON.parse(localStorage.getItem('dailyEntries') || '[]');
  const filtered = saved.filter(entry => entry.date !== dateToDelete);
  localStorage.setItem('dailyEntries', JSON.stringify(filtered));
}

// 5. Générer un vrai PDF
async function generatePDF() {
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

// N’oublie pas dans ton HTML :
// <form onsubmit="saveDaily(event)"> …
// <button onclick="generatePDF()">📄 Générer PDF</button>
// Fonction : sauvegarder le texte du journal
function saveJournal() {
  const text = document.getElementById('journal-entry').value;
  const date = new Date().toLocaleDateString();
  const output = document.getElementById('journal-output');
  output.innerHTML += <p><strong>${date}</strong>: ${text}</p>;
  document.getElementById('journal-entry').value = '';
}
