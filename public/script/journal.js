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
