const firebaseConfig = {
  apiKey: "AIzaSyAenWIP-paGbvugvr39gOKeYsqGhPQxf2o",
  authDomain: "new-gains-tracker.firebaseapp.com",
  projectId: "new-gains-tracker",
  storageBucket: "new-gains-tracker.appspot.com",
  messagingSenderId: "459556173331",
  appId: "1:459556173331:web:0894ade4f3d949462af1e6"
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