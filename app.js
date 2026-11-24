const WHATSAPP_NUM = "50664784402"; 

const tasas = {
  "CRC_VES": 960,
  "VES_CRC": 350.40,
  "CRC_COP": 3.159,
  "COP_CRC": 350.40,
  "COP_VES": 960,
  "VES_COP": 2.869
};

const monedas = {
  "CRC_VES": { entrada: "₡", salida: "Bs.", nombreEntrada: "CRC", nombreSalida: "VES" },
  "VES_CRC": { entrada: "Bs.", salida: "₡", nombreEntrada: "VES", nombreSalida: "CRC" },
  "CRC_COP": { entrada: "₡", salida: "$", nombreEntrada: "CRC", nombreSalida: "COP" },
  "COP_CRC": { entrada: "$", salida: "₡", nombreEntrada: "COP", nombreSalida: "CRC" },
  "COP_VES": { entrada: "$", salida: "Bs.", nombreEntrada: "COP", nombreSalida: "VES" },
  "VES_COP": { entrada: "Bs.", salida: "$", nombreEntrada: "VES", nombreSalida: "COP" }
};

const rutaEl = document.getElementById('ruta');
const montoEl = document.getElementById('monto');
const tasaEl = document.getElementById('tasa');
const resultadoEl = document.getElementById('resultado');
const whatsappBtn = document.getElementById('whatsapp');
const labelMoneda = document.getElementById('moneda-entrada-label');
const btnCopiar = document.getElementById('btn-copiar');
const btnsQuick = document.querySelectorAll('.btn-quick');

// Variables para la animación del número
let animacionFrame;
let valorActual = 0;

function animarResultado(valorFinal) {
  cancelAnimationFrame(animacionFrame);
  const duracion = 500; // ms
  const inicio = performance.now();
  const valorInicial = valorActual;

  function paso(tiempoActual) {
    const tiempoTranscurrido = tiempoActual - inicio;
    const progreso = Math.min(tiempoTranscurrido / duracion, 1);
    
    // Función de easing (suavizado)
    const easeOutQuart = 1 - Math.pow(1 - progreso, 4);
    
    valorActual = valorInicial + (valorFinal - valorInicial) * easeOutQuart;
    
    const moneda = monedas[rutaEl.value];
    resultadoEl.textContent = `${moneda.salida} ${valorActual.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (progreso < 1) {
      animacionFrame = requestAnimationFrame(paso);
    } else {
      valorActual = valorFinal; // Asegurar precisión al final
    }
  }
  
  animacionFrame = requestAnimationFrame(paso);
}

function calcular(animar = true) {
  const ruta = rutaEl.value;
  const monto = parseFloat(montoEl.value) || 0;
  const tasa = tasas[ruta];
  const moneda = monedas[ruta];

  labelMoneda.textContent = moneda.nombreEntrada;
  tasaEl.textContent = `${moneda.entrada}1 = ${tasa} ${moneda.salida}`;
  
  const resultado = monto * tasa;

  if (animar) {
    animarResultado(resultado);
  } else {
    valorActual = resultado;
    resultadoEl.textContent = `${moneda.salida} ${resultado.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const mensaje = encodeURIComponent(
    `Hola PanaSur Express (Darwin), quiero enviar por la ruta ${ruta.replace('_',' a ')} un monto de ${moneda.entrada}${monto.toLocaleString()}. Según la web, recibiría ${moneda.salida}${resultado.toFixed(2)}.`
  );
  whatsappBtn.href = `https://wa.me/${WHATSAPP_NUM}?text=${mensaje}`;
}

// Eventos
rutaEl.addEventListener('change', () => calcular(false)); // Cambio de ruta sin animación brusca
montoEl.addEventListener('input', () => calcular(true));

// Botones de sumar rápido
btnsQuick.forEach(btn => {
  btn.addEventListener('click', () => {
    const amount = parseFloat(btn.dataset.amount);
    const current = parseFloat(montoEl.value) || 0;
    montoEl.value = current + amount;
    calcular(true);
  });
});

// Copiar al portapapeles
btnCopiar.addEventListener('click', () => {
  const texto = resultadoEl.textContent;
  navigator.clipboard.writeText(texto).then(() => {
    btnCopiar.textContent = "✅";
    setTimeout(() => btnCopiar.textContent = "📋", 2000);
  });
});

// Inicializar
calcular(false);