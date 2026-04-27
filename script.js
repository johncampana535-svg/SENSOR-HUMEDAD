const token = "e8e28909-6ba4-4f64-8ce4-e301adfd7a85";
const variable = "Distance";

const avion = document.getElementById("avion");
const texto = document.getElementById("dist");
const estado = document.getElementById("estado");
const root = document.documentElement;

async function actualizar() {
  try {
    const res = await fetch(`https://api.tago.io/data?variable=${variable}&qty=1`, {
      headers: { "Device-Token": token }
    });

    const data = await res.json();

    if (!data.result || data.result.length === 0) return;

    let d = parseFloat(data.result[0].value);
    if (isNaN(d)) d = 0;

    actualizarUI(d);

  } catch {
    estado.innerText = "Error";
  }
}

function actualizarUI(d) {
  texto.innerText = d.toFixed(1) + " cm";

  // mover avión (izquierda a derecha)
  let pos = Math.min((d / 50) * 100, 100);
  avion.style.left = pos + "%";

  // cambio de fondo
  if (d === 0) {
    estado.innerText = "Sin detección";
    root.style.setProperty('--bg', 'gray');
  } 
  else if (d <= 5) {
    estado.innerText = "Muy cerca";
    root.style.setProperty('--bg', 'red');
  } 
  else if (d <= 20) {
    estado.innerText = "Cercano";
    root.style.setProperty('--bg', 'orange');
  } 
  else if (d <= 50) {
    estado.innerText = "Distancia media";
    root.style.setProperty('--bg', 'skyblue');
  } 
  else {
    estado.innerText = "Lejos";
    root.style.setProperty('--bg', 'blue');
  }
}

setInterval(actualizar, 1000);
actualizar();
