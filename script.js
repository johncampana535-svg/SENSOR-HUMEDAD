const token = "e8e28909-6ba4-4f64-8ce4-e301adfd7a85";
const variable = "Distance";

const plane = document.getElementById("plane");
const dist = document.getElementById("dist");
const state = document.getElementById("state");
const sky = document.getElementById("sky");

async function update() {
  try {
    const res = await fetch(`https://api.tago.io/data?variable=${variable}&qty=1`, {
      headers: { "Device-Token": token }
    });

    const data = await res.json();
    if (!data.result || data.result.length === 0) return;

    let d = parseFloat(data.result[0].value);
    if (isNaN(d)) d = 0;

    updateUI(d);

  } catch {
    state.innerText = "Error conexión";
  }
}

function updateUI(d) {
  dist.innerText = d.toFixed(1) + " cm";

  // Movimiento avión (horizontal + leve vertical)
  let x = Math.min((d / 50) * 100, 100);
  let y = 80 + (50 - d); // baja cuando se acerca

  plane.style.left = x + "%";
  plane.style.top = y + "px";

  // Fondo dinámico tipo día → noche
  if (d === 0) {
    sky.style.background = "gray";
    state.innerText = "Sin detección";
    sky.classList.remove("alert");
  }
  else if (d <= 5) {
    sky.style.background = "darkred";
    state.innerText = "MUY CERCA ⚠️";
    sky.classList.add("alert");
  }
  else if (d <= 20) {
    sky.style.background = "orange";
    state.innerText = "Cercano";
    sky.classList.remove("alert");
  }
  else if (d <= 50) {
    sky.style.background = "linear-gradient(#87ceeb, #e0f6ff)";
    state.innerText = "Normal";
    sky.classList.remove("alert");
  }
  else {
    sky.style.background = "linear-gradient(#0f172a, #020617)";
    state.innerText = "Lejos";
    sky.classList.remove("alert");
  }
}

setInterval(update, 1000);
update();
