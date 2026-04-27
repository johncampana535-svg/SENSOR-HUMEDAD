const token = "e8e28909-6ba4-4f64-8ce4-e301adfd7a85";
const variable = "Distance";

const valor = document.getElementById("valor");
const estado = document.getElementById("estado");

// gauge tipo dona
const gauge = new Chart(document.getElementById("gauge"), {
  type: "doughnut",
  data: {
    datasets: [{
      data: [0, 100],
      backgroundColor: ["green", "#e5e7eb"],
      borderWidth: 0
    }]
  },
  options: {
    cutout: "80%",
    plugins: { legend: { display: false } }
  }
});

// gráfica historial
const grafica = new Chart(document.getElementById("grafica"), {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      data: [],
      borderColor: "blue",
      tension: 0.3
    }]
  }
});

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
  valor.innerText = d.toFixed(1) + " cm";

  let porcentaje = Math.min(d, 100);

  gauge.data.datasets[0].data = [porcentaje, 100 - porcentaje];

  // colores suaves
  let color = "green";
  if (d === 0) {
    estado.innerText = "Sin detección";
    color = "gray";
  } 
  else if (d <= 5) {
    estado.innerText = "Peligro";
    color = "red";
  } 
  else if (d <= 20) {
    estado.innerText = "Cerca";
    color = "orange";
  } 
  else {
    estado.innerText = "Seguro";
    color = "green";
  }

  gauge.data.datasets[0].backgroundColor = [color, "#e5e7eb"];

  // historial
  grafica.data.labels.push("");
  grafica.data.datasets[0].data.push(d);

  if (grafica.data.labels.length > 10) {
    grafica.data.labels.shift();
    grafica.data.datasets[0].data.shift();
  }

  gauge.update();
  grafica.update();
}

setInterval(actualizar, 1000);
actualizar();
