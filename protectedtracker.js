// Bloque l'accès à la page si l'utilisateur n'est pas connecté, redirige vers login.html
const waitForFirebase = () => new Promise(resolve => {
  if (window.firebase && window.firebase.auth) return resolve();
  const check = setInterval(() => {
    if (window.firebase && window.firebase.auth) {
      clearInterval(check);
      resolve();
    }
  }, 50);
});

waitForFirebase().then(() => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
      window.location.href = "login.html";
    }
  });
});