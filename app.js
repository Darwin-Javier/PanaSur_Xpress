const WHATSAPP_NUM = "50664784402"; 

let tasasPorUSD = {};

const monedas = {
  "CRC_VES": { entrada: "₡", salida: "Bs.", nombreEntrada: "CRC", nombreSalida: "VES" },
  "VES_CRC": { entrada: "Bs.", salida: "₡", nombreEntrada: "VES", nombreSalida: "CRC" },
  "CRC_COP": { entrada: "₡", salida: "COP", nombreEntrada: "CRC", nombreSalida: "COP" },
  "COP_CRC": { entrada: "COP", salida: "₡", nombreEntrada: "COP", nombreSalida: "CRC" },
  "COP_VES": { entrada: "COP", salida: "Bs.", nombreEntrada: "COP", nombreSalida: "VES" },
  "VES_COP": { entrada: "Bs.", salida: "COP", nombreEntrada: "VES", nombreSalida: "COP" }
};

const rutaEl = document.getElementById('ruta');
const montoEl = document.getElementById('monto');
const tasaEl = document.getElementById('tasa');
const resultadoEl = document.getElementById('resultado');
const whatsappBtn = document.getElementById('whatsapp');
const labelMoneda = document.getElementById('moneda-entrada-label');
const fechaTasasEl = document.getElementById('fecha-tasas');
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

function formatearTasaRecibida(valor, moneda) {
  if (moneda.nombreSalida === "CRC") {
    return `₡${valor.toFixed(2)}`;
  }

  const locale = moneda.nombreSalida === "COP" ? "es-CO" : "es-CR";
  return `${valor.toLocaleString(locale, { maximumFractionDigits: 2 })} ${moneda.salida}`;
}

function calcular(animar = true) {
  const ruta = rutaEl.value;
  const monto = parseFloat(montoEl.value) || 0;
  const tasa = tasasPorUSD[ruta];
  const moneda = monedas[ruta];

  labelMoneda.textContent = moneda.nombreEntrada;
  if (!tasa || !Number.isFinite(tasa.entrada) || !Number.isFinite(tasa.salida) || tasa.entrada <= 0 || tasa.salida <= 0) {
    tasaEl.textContent = "Tasa no disponible";
    resultadoEl.textContent = "—";
    whatsappBtn.removeAttribute('href');
    whatsappBtn.setAttribute('aria-disabled', 'true');
    return;
  }

  tasaEl.textContent = `$1 = ${formatearTasaRecibida(tasa.salida, moneda)}`;
  
  const resultado = (monto / tasa.entrada) * tasa.salida;

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
  whatsappBtn.setAttribute('aria-disabled', 'false');
}

function cargarTasas() {
  const datos = window.PANASUR_TASAS;
  const rutas = Object.keys(monedas);
  const fechaValida = datos
    && /^\d{4}-\d{2}-\d{2}$/.test(datos.actualizado)
    && Number.isFinite(Date.parse(`${datos.actualizado}T00:00:00`));
  const tasasValidas = datos && datos.tasasPorUSD
    && rutas.every(ruta => {
      const tasa = datos.tasasPorUSD[ruta];
      return tasa
        && Number.isFinite(tasa.entrada)
        && Number.isFinite(tasa.salida)
        && tasa.entrada > 0
        && tasa.salida > 0;
    });

  if (!fechaValida || !tasasValidas) {
    console.error("El archivo tasas.js no existe o tiene datos inválidos.");
    tasaEl.textContent = "Tasas no disponibles";
    resultadoEl.textContent = "—";
    whatsappBtn.removeAttribute('href');
    whatsappBtn.setAttribute('aria-disabled', 'true');
    return;
  }

  tasasPorUSD = datos.tasasPorUSD;
  fechaTasasEl.textContent = new Date(`${datos.actualizado}T00:00:00`).toLocaleDateString('es-CR');
  calcular(false);
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

// Inicializar tasas desde el archivo de configuración
cargarTasas();