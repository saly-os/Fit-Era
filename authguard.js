// Authentification Firebase avec version modulaire (v9+)
// N'oublie pas d'inclure le SDK Firebase Auth dans ton HTML si ce n'est pas déjà fait :
// <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"></script>

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyApHKktjUp1693l2WrODGM8WVf1zsb_4Co",
  authDomain: "fit-journey-c9595.firebaseapp.com",
  projectId: "fit-journey-c9595",
  storageBucket: "fit-journey-c9595.firebasestorage.app",
  messagingSenderId: "743314539613",
  appId: "1:743314539613:web:09a5a6d17bea2375a1b9b4"
};

// Initialiser Firebase
if (!window.firebaseAppInitialized) {
  firebase.initializeApp(firebaseConfig);
  window.firebaseAppInitialized = true;
}
const auth = firebase.auth();

// Fonction d'inscription
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      document.getElementById("auth-message").innerText = "🎉 Compte créé avec succès !";
      document.getElementById("logout").style.display = "inline-block";
    })
    .catch((error) => {
      document.getElementById("auth-message").innerText = error.message;
    });
}

// Fonction de connexion
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      document.getElementById("auth-message").innerText = "👑 Connexion réussie, Queen !";
      document.getElementById("logout").style.display = "inline-block";
    })
    .catch((error) => {
      document.getElementById("auth-message").innerText = error.message;
    });
}

// Fonction de déconnexion
function logout() {
  auth.signOut()
    .then(() => {
      document.getElementById("auth-message").innerText = "👋 Déconnexion réussie !";
      document.getElementById("logout").style.display = "none";
    })
    .catch((error) => {
      document.getElementById("auth-message").innerText = error.message;
    });
}

// Afficher/Masquer bouton logout selon l’état de connexion
auth.onAuthStateChanged((user) => {
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.style.display = user ? "inline-block" : "none";
  }
});