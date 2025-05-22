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

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('welcome').innerText = `Hello, ${user.email} 🌸`;
    document.getElementById('dashboard-message').innerText = "Retrouve tous tes trackers dans le menu !";
  } else {
    document.getElementById('welcome').innerText = "Bienvenue, Queen !";
    document.getElementById('dashboard-message').innerText = "Connecte-toi pour accéder à ton espace personnel.";
  }
});