const WHATSAPP_NUM = "50664784402"; 

// ==========================================
// ⚠️ TUS TASAS REALES DE HOY
// ==========================================
// dolarOrigen: Lo que cuesta 1 USD en el país de donde envían.
// tasaVenta: Lo que TÚ pagas por cada 1 USD en el país de destino.
// (El cliente solo verá el resultado final, esta cuenta es interna para ti).

const config = {
  "CRC_VES": {
    dolarOrigen: 444.69, // Dólar en Costa Rica
    tasaVenta: 960.00,   // Pago en Bs por cada dólar
    simboloEntrada: "₡", simboloSalida: "Bs.",
    nombreEntrada: "CRC", nombreSalida: "VES"
  },
  "VES_CRC": {
    dolarOrigen: 45.00,  // Dólar en Venezuela (ajústalo a tu referencia)
    tasaVenta: 343.40,   // Pago en Colones por cada dólar
    simboloEntrada: "Bs.", simboloSalida: "₡",
    nombreEntrada: "VES", nombreSalida: "CRC"
  },
  "CRC_COP": {
    dolarOrigen: 444.69, // Dólar en Costa Rica
    tasaVenta: 3300.27,  // Pago en Pesos por cada dólar (ruta CR->CO)
    simboloEntrada: "₡", simboloSalida: "$",
    nombreEntrada: "CRC", nombreSalida: "COP"
  },
  "COP_CRC": {
    dolarOrigen: 3524.72, // Dólar en Colombia
    tasaVenta: 343.40,    // Pago en Colones por cada dólar
    simboloEntrada: "$", simboloSalida: "₡",
    nombreEntrada: "COP", nombreSalida: "CRC"
  },
  "COP_VES": {
    dolarOrigen: 3524.72, // Dólar en Colombia
    tasaVenta: 960.00,    // Pago en Bs por cada dólar
    simboloEntrada: "$", simboloSalida: "Bs.",
    nombreEntrada: "COP", nombreSalida: "VES"
  },
  "VES_COP": {
    dolarOrigen: 45.00,   // Dólar en Venezuela
    tasaVenta: 3010.27,   // Pago en Pesos por cada dólar (ruta VE->CO)
    simboloEntrada: "Bs.", simboloSalida: "$",
    nombreEntrada: "VES", nombreSalida: "COP"
  }
};

const rutaEl = document.getElementById('ruta');
const montoEl = document.getElementById('monto');
const tasaEl = document.getElementById('tasa');
const resultadoEl = document.getElementById('resultado');
const whatsappBtn = document.getElementById('whatsapp');
const labelMoneda = document.getElementById('moneda-entrada-label');
const btnCopiar = document.getElementById('btn-copiar');
const btnsQuick = document.querySelectorAll('.btn-quick');

let animacionFrame;
let valorActual = 0;

function animarResultado(valorFinal, configActual) {
  cancelAnimationFrame(animacionFrame);
  const duracion = 500; 
  const inicio = performance.now();
  const valorInicial = valorActual;

  function paso(tiempoActual) {
    const tiempoTranscurrido = tiempoActual - inicio;
    const progreso = Math.min(tiempoTranscurrido / duracion, 1);
    const easeOutQuart = 1 - Math.pow(1 - progreso, 4);
    valorActual = valorInicial + (valorFinal - valorInicial) * easeOutQuart;
    
    resultadoEl.textContent = `${configActual.simboloSalida} ${valorActual.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (progreso < 1) {
      animacionFrame = requestAnimationFrame(paso);
    } else {
      valorActual = valorFinal; 
    }
  }
  animacionFrame = requestAnimationFrame(paso);
}

function calcular(animar = true) {
  const ruta = rutaEl.value;
  const monto = parseFloat(montoEl.value) || 0;
  const conf = config[ruta];

  // 1. Convertimos el monto del cliente a Dólares
  const dolaresEquivalentes = monto / conf.dolarOrigen;
  
  // 2. Convertimos esos Dólares a la moneda que recibe el cliente
  const resultadoFinal = dolaresEquivalentes * conf.tasaVenta;

  labelMoneda.textContent = conf.nombreEntrada;
  
  // Tasa pública (lo que ve el cliente en el texto de arriba)
  const tasaPublica = monto > 0 ? (resultadoFinal / monto) : 0;
  tasaEl.textContent = `${conf.simboloEntrada}1 = ${tasaPublica.toFixed(4)} ${conf.simboloSalida}`;
  
  if (animar) {
    animarResultado(resultadoFinal, conf);
  } else {
    valorActual = resultadoFinal;
    resultadoEl.textContent = `${conf.simboloSalida} ${resultadoFinal.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const mensaje = encodeURIComponent(
    `Hola PanaSur Express (Darwin), quiero enviar por la ruta ${ruta.replace('_',' a ')} un monto de ${conf.simboloEntrada}${monto.toLocaleString()}. Según la web, recibiría ${conf.simboloSalida}${resultadoFinal.toFixed(2)}.`
  );
  whatsappBtn.href = `https://wa.me/${WHATSAPP_NUM}?text=${mensaje}`;
}

rutaEl.addEventListener('change', () => calcular(false)); 
montoEl.addEventListener('input', () => calcular(true));

btnsQuick.forEach(btn => {
  btn.addEventListener('click', () => {
    const amount = parseFloat(btn.dataset.amount);
    const current = parseFloat(montoEl.value) || 0;
    montoEl.value = current + amount;
    calcular(true);
  });
});

btnCopiar.addEventListener('click', () => {
  const texto = resultadoEl.textContent;
  navigator.clipboard.writeText(texto).then(() => {
    btnCopiar.textContent = "✅";
    setTimeout(() => btnCopiar.textContent = "📋", 2000);
  });
});

calcular(false);