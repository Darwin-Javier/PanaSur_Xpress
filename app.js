const WHATSAPP_NUM = "50664784402"; // sin + ni espacios
let tasas = {};

// Cargar tasas desde JSON
fetch('tasas.json')
  .then(res => {
    if (!res.ok) throw new Error(`No se pudo cargar tasas.json (${res.status})`);
    return res.json();
  })
  .then(data => {
    if (!data || typeof data.tasas !== 'object') {
      throw new Error('El archivo de tasas tiene un formato inválido');
    }
    tasas = data.tasas;
    document.getElementById('fecha').textContent = data.actualizado || '—';
    calcular();
  })
  .catch(err => {
    console.error("Error cargando tasas:", err);
    tasaEl.textContent = "No disponible";
    resultadoEl.textContent = "—";
  });

// Elementos
const rutaEl = document.getElementById('ruta');
const montoEl = document.getElementById('monto');
const tasaEl = document.getElementById('tasa');
const resultadoEl = document.getElementById('resultado');
const whatsappBtn = document.getElementById('whatsapp');

function calcular() {
  const ruta = rutaEl.value;
  const monto = Number.parseFloat(montoEl.value);
  const montoValido = Number.isFinite(monto) && monto >= 0;
  const tasa = tasas[ruta];

  if (!montoValido) {
    tasaEl.textContent = tasa ? `1 = ${tasa}` : "—";
    resultadoEl.textContent = "—";
    whatsappBtn.removeAttribute('href');
    return;
  }

  if (!tasa || !Number.isFinite(tasa) || tasa <= 0) {
    tasaEl.textContent = "—";
    resultadoEl.textContent = "—";
    whatsappBtn.removeAttribute('href');
    return;
  }

  tasaEl.textContent = `1 = ${tasa}`;
  const resultado = monto * tasa;
  resultadoEl.textContent = resultado.toLocaleString('es-CR', { maximumFractionDigits: 2 });

  // Actualizar WhatsApp con contexto
  const nombreRuta = rutaEl.options[rutaEl.selectedIndex].text;
  const mensaje = encodeURIComponent(
    `Hola PanaSur Xpress, quiero enviar por la ruta ${nombreRuta} un monto de ${monto}. Según su web recibiría ${resultado.toFixed(2)}.`
  );
  whatsappBtn.href = `https://wa.me/${WHATSAPP_NUM}?text=${mensaje}`;
}

// Eventos en tiempo real
rutaEl.addEventListener('change', calcular);
montoEl.addEventListener('input', calcular);