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