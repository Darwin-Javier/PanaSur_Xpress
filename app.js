const WHATSAPP_NUM = "50664784402"; // Tu número sin + ni espacios

// TUS TASAS REALES
const tasas = {
  "CRC_VES": 960,
  "VES_CRC": 350.40,
  "CRC_COP": 3.159,
  "COP_CRC": 350.40,
  "COP_VES": 960,
  "VES_COP": 2.869
};

// Nombres de las monedas para mostrar en el resultado
const monedas = {
  "CRC_VES": { entrada: "CRC", salida: "VES" },
  "VES_CRC": { entrada: "VES", salida: "CRC" },
  "CRC_COP": { entrada: "CRC", salida: "COP" },
  "COP_CRC": { entrada: "COP", salida: "CRC" },
  "COP_VES": { entrada: "COP", salida: "VES" },
  "VES_COP": { entrada: "VES", salida: "COP" }
};

const rutaEl = document.getElementById('ruta');
const montoEl = document.getElementById('monto');
const tasaEl = document.getElementById('tasa');
const resultadoEl = document.getElementById('resultado');
const whatsappBtn = document.getElementById('whatsapp');

function calcular() {
  const ruta = rutaEl.value;
  const monto = parseFloat(montoEl.value) || 0;
  const tasa = tasas[ruta];
  const moneda = monedas[ruta];

  // Mostrar la tasa del día
  tasaEl.textContent = `1 ${moneda.entrada} = ${tasa} ${moneda.salida}`;
  
  // Calcular y mostrar el resultado
  const resultado = monto * tasa;
  resultadoEl.textContent = `${resultado.toLocaleString('es-CR', { maximumFractionDigits: 2 })} ${moneda.salida}`;

  // Actualizar el botón de WhatsApp
  const mensaje = encodeURIComponent(
    `Hola PanaSur Express (Darwin), acabo de calcular en la web. Quiero enviar por la ruta ${ruta.replace('_',' a ')} un monto de ${monto} ${moneda.entrada}. Según la página, recibiría ${resultado.toFixed(2)} ${moneda.salida}.`
  );
  whatsappBtn.href = `https://wa.me/${WHATSAPP_NUM}?text=${mensaje}`;
}

// Eventos en tiempo real
rutaEl.addEventListener('change', calcular);
montoEl.addEventListener('input', calcular);