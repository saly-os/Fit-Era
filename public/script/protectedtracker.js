import { protectPage } from "scripts/authguard.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";  

protectPage((user) => {
  // Ton code ici, pour charger les données, gérer la page, etc.
  console.log("Connecté :", user.email);

  // Exemple : afficher le nom de l’utilisateur sur la page
  // document.getElementById("username").innerText = user.displayName || user.email;
});