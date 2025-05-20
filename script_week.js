function saveWeekly(event) {
  event.preventDefault();

  const date = document.getElementById("week-date").value;
  const poids = document.getElementById("week-poids").value;
  const eau = document.getElementById("week-eau").value;
  const workout = document.getElementById("week-workout").value;
  const ressenti = document.getElementById("week-ressenti").value;

  const entry = { date, poids, eau, workout, ressenti };

  let weeklyEntries = JSON.parse(localStorage.getItem("weeklyEntries")) || [];
  weeklyEntries.push(entry);
  localStorage.setItem("weeklyEntries", JSON.stringify(weeklyEntries));

  displayWeeklyEntries();
  event.target.reset();
}

function displayWeeklyEntries() {
  const weeklyTable = document.getElementById("weekly-table-body");
  weeklyTable.innerHTML = "";

  const entries = JSON.parse(localStorage.getItem("weeklyEntries")) || [];

  entries.forEach((entry) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.poids}</td>
      <td>${entry.eau}</td>
      <td>${entry.workout}</td>
      <td>${entry.ressenti}</td>
    `;
    weeklyTable.appendChild(row);
  });
}

// Pour que les données s'affichent dès qu'on ouvre la page
window.addEventListener("DOMContentLoaded", displayWeeklyEntries);