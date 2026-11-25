const WHATSAPP_NUM = "50664784402"; 

// Configuración interna: (Monto / dolarOrigen) * tasaVenta
const config = {
  "CRC_VES": { dolarOrigen: 444.69, tasaVenta: 960.00, simboloEntrada: "₡", simboloSalida: "Bs.", nombreEntrada: "CRC", nombreSalida: "VES" },
  "VES_CRC": { dolarOrigen: 45.00,  tasaVenta: 343.40, simboloEntrada: "Bs.", simboloSalida: "₡", nombreEntrada: "VES", nombreSalida: "CRC" },
  "CRC_COP": { dolarOrigen: 444.69, tasaVenta: 3300.27, simboloEntrada: "₡", simboloSalida: "$", nombreEntrada: "CRC", nombreSalida: "COP" },
  "COP_CRC": { dolarOrigen: 3524.72, tasaVenta: 343.40, simboloEntrada: "$", simboloSalida: "₡", nombreEntrada: "COP", nombreSalida: "CRC" },
  "COP_VES": { dolarOrigen: 3524.72, tasaVenta: 960.00, simboloEntrada: "$", simboloSalida: "Bs.", nombreEntrada: "COP", nombreSalida: "VES" },
  "VES_COP": { dolarOrigen: 45.00,   tasaVenta: 3010.27, simboloEntrada: "Bs.", simboloSalida: "$", nombreEntrada: "VES", nombreSalida: "COP" }
};

const rutaEl = document.getElementById('ruta');
const montoEl = document.getElementById('monto');
const tasaEl = document.getElementById('tasa');
const resultadoEl = document.getElementById('resultado');
const whatsappBtn = document.getElementById('whatsapp');
const labelMoneda = document.getElementById('moneda-entrada-label');
const btnCopiar = document.getElementById('btn-copiar');
const btnsQuick = document.querySelectorAll('.btn-quick');
const fechaEl = document.getElementById('fecha-actualizacion');

// Fecha de hoy automática
const hoy = new Date();
fechaEl.textContent = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;

let animacionFrame;
let valorActual = 0;

function animarResultado(valorFinal, conf) {
  cancelAnimationFrame(animacionFrame);
  const duracion = 500; 
  const inicio = performance.now();
  const valorInicial = valorActual;

  function paso(tiempoActual) {
    const tiempoTranscurrido = tiempoActual - inicio;
    const progreso = Math.min(tiempoTranscurrido / duracion, 1);
    const easeOutQuart = 1 - Math.pow(1 - progreso, 4);
    valorActual = valorInicial + (valorFinal - valorInicial) * easeOutQuart;
    
    resultadoEl.textContent = `${conf.simboloSalida} ${valorActual.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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

  // Lógica de cálculo interno (usando dólar)
  const dolaresEquivalentes = monto / conf.dolarOrigen;
  const resultadoFinal = dolaresEquivalentes * conf.tasaVenta;

  labelMoneda.textContent = conf.nombreEntrada;
  
  // Mostrar la tasa de referencia en dólares
  tasaEl.textContent = `$1 = ${conf.tasaVenta} ${conf.simboloSalida}`;
  
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

// Eventos
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

// Ejecutar al cargar
calcular(false);