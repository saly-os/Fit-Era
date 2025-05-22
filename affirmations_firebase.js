const firebaseConfig = {
  apiKey: "AIzaSyApHKktjUp1693l2WrODGM8WVf1zsb_4Co",
  authDomain: "fit-journey-c9595.firebaseapp.com",
  projectId: "fit-journey-c9595",
  storageBucket: "fit-journey-c9595.firebasestorage.app",
  messagingSenderId: "743314539613",
  appId: "1:743314539613:web:09a5a6d17bea2375a1b9b4"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

auth.onAuthStateChanged(user => {
  currentUser = user;
  if (user) {
    document.getElementById('affirmations-message').innerText = "Connectée en tant que " + (user.email || "");
    loadAffirmations();
  } else {
    document.getElementById('affirmations-message').innerText = "Connecte-toi pour voir/ajouter tes affirmations.";
    document.getElementById('affirmations-list').innerHTML = "";
  }
});

// Ajout affirmation utilisateur
document.getElementById('affirmation-form').addEventListener('submit', async e => {
  e.preventDefault();
  if (!currentUser) return alert("Connecte-toi !");
  const text = document.getElementById('affirmation-input').value.trim();
  if (!text) return;
  await db.collection("affirmations").add({
    userId: currentUser.uid,
    text
  });
  document.getElementById('affirmation-form').reset();
  loadAffirmations();
});

// Afficher affirmations utilisateur
async function loadAffirmations() {
  const ref = db.collection("affirmations");
  const snap = await ref.where("userId", "==", currentUser.uid).get();
  const ul = document.getElementById('affirmations-list');
  ul.innerHTML = "";
  snap.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = doc.data().text;
    const del = document.createElement("button");
    del.textContent = "🗑";
    del.onclick = async () => {
      await db.collection("affirmations").doc(doc.id).delete();
      loadAffirmations();
    };
    li.appendChild(del);
    ul.appendChild(li);
  });
}