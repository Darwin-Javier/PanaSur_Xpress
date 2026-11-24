// Actualiza la fecha y las cantidades cada día. "entrada" es la moneda enviada
// por 1 USD y "salida" la moneda recibida por 1 USD.
window.PANASUR_TASAS = {
  actualizado: "2026-11-24",
  tasasPorUSD: {
    CRC_VES: { entrada: 350.40, salida: 960 }, // Costa Rica a Venezuela
    VES_CRC: { entrada: 960, salida: 350.40 }, // Venezuela a Costa Rica
    CRC_COP: { entrada: 350.40, salida: 3159 }, // Costa Rica a Colombia
    COP_CRC: { entrada: 3159, salida: 350.40 }, // Colombia a Costa Rica
    COP_VES: { entrada: 3159, salida: 960 }, // Colombia a Venezuela
    VES_COP: { entrada: 960, salida: 2869 } // Venezuela a Colombia
  }
};
