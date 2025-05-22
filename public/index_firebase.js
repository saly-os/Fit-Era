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

auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('welcome').innerText = `Hello, ${user.email} 🌸`;
    document.getElementById('dashboard-message').innerText = "Retrouve tous tes trackers dans le menu !";
  } else {
    document.getElementById('welcome').innerText = "Bienvenue, Queen !";
    document.getElementById('dashboard-message').innerText = "Connecte-toi pour accéder à ton espace personnel.";
  }
});