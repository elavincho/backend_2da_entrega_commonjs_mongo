function agregarRenglon() {
  const tbody = document.querySelector("#conceptosTable tbody");
  const newRow = tbody.rows[0].cloneNode(true);
  newRow.querySelectorAll("input").forEach((input) => (input.value = ""));
  newRow.querySelector('input[name="conceptos[debe][]"]').value = "0";
  newRow.querySelector('input[name="conceptos[haber][]"]').value = "0";
  newRow.querySelector('input[name="conceptos[montoImpuesto][]"]').value = "0";
  tbody.appendChild(newRow);
  recalcularTotales();
}

function eliminarRenglon(btn) {
  const tbody = document.querySelector("#conceptosTable tbody");
  if (tbody.rows.length > 1) {
    btn.closest("tr").remove();
    recalcularTotales();
  }
}

function recalcularTotales() {
  let subtotalDebe = 0;
  let subtotalHaber = 0;
  let subtotalImpuesto = 0;
  let subtotalNeto = 0;

  document.querySelectorAll("#conceptosTable tbody tr").forEach((row) => {
    const debe =
      parseFloat(row.querySelector('input[name="conceptos[debe][]"]').value) ||
      0;
    const haber =
      parseFloat(row.querySelector('input[name="conceptos[haber][]"]').value) ||
      0;
    const impuesto =
      parseFloat(
        row.querySelector('input[name="conceptos[montoImpuesto][]"]').value,
      ) || 0;
    const neto = debe + haber + impuesto;

    subtotalDebe += debe;
    subtotalHaber += haber;
    subtotalImpuesto += impuesto;
    subtotalNeto += neto;

    row.querySelector('input[name="conceptos[netoRenglon][]"]').value =
      neto.toFixed(2);
  });

  document.getElementById("subtotalDebe").value = subtotalDebe.toLocaleString(
    "es-AR",
    { minimumFractionDigits: 2 },
  );
  document.getElementById("subtotalHaber").value = subtotalHaber.toLocaleString(
    "es-AR",
    { minimumFractionDigits: 2 },
  );
  document.getElementById("subtotalImpuesto").value =
    subtotalImpuesto.toLocaleString("es-AR", { minimumFractionDigits: 2 });
  document.getElementById("subtotalNeto").value = subtotalNeto.toLocaleString(
    "es-AR",
    { minimumFractionDigits: 2 },
  );

  calcularMontoAPagar();
}

function calcularMontoAPagar() {
  const subtotalNeto =
    parseFloat(
      document
        .getElementById("subtotalNeto")
        .value.replace(/\./g, "")
        .replace(",", "."),
    ) || 0;
  const retencion =
    parseFloat(document.getElementById("totalRetencion").value) || 0;
  const montoAPagar = subtotalNeto - retencion;
  document.getElementById("montoAPagar").value = montoAPagar.toFixed(2);
}

document.querySelectorAll(".calcular").forEach((input) => {
  input.addEventListener("change", recalcularTotales);
});

// Scripts Factura Proveedor

function agregarRenglon() {
  const tbody = document.querySelector("#detalleTable tbody");
  const newRow = tbody.rows[0].cloneNode(true);
  newRow.querySelectorAll("input").forEach((input) => {
    if (input.type !== "button") input.value = "";
  });
  newRow.querySelector('input[name="detalles[cantidad][]"]').value = "1";
  newRow.querySelector('input[name="detalles[precioUnitario][]"]').value = "0";
  tbody.appendChild(newRow);
  recalcularTotales();
}

function eliminarRenglon(btn) {
  const tbody = document.querySelector("#detalleTable tbody");
  if (tbody.rows.length > 1) {
    btn.closest("tr").remove();
    recalcularTotales();
  }
}

function recalcularTotales() {
  let subtotalNeto = 0;
  let iva21Total = 0;
  let iva105Total = 0;

  document.querySelectorAll("#detalleTable tbody tr").forEach((row) => {
    const cantidad =
      parseFloat(
        row.querySelector('input[name="detalles[cantidad][]"]').value,
      ) || 0;
    const precio =
      parseFloat(
        row.querySelector('input[name="detalles[precioUnitario][]"]').value,
      ) || 0;
    const alicIva = row.querySelector(
      'select[name="detalles[alicIva][]"]',
    ).value;
    const importe = cantidad * precio;

    row.querySelector('input[name="detalles[importe][]"]').value =
      importe.toFixed(2);

    subtotalNeto += importe;
    if (alicIva === "21%") {
      iva21Total += importe * 0.21;
    } else if (alicIva === "10.5%") {
      iva105Total += importe * 0.105;
    }
  });

  const otrosTributos =
    parseFloat(document.getElementById("otrosTributos").value) || 0;
  const total = subtotalNeto + iva21Total + iva105Total + otrosTributos;

  document.getElementById("subtotalNeto").value = subtotalNeto.toFixed(2);
  document.getElementById("iva21").value = iva21Total.toFixed(2);
  document.getElementById("iva105").value = iva105Total.toFixed(2);
  document.getElementById("total").value = total.toFixed(2);
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".calcular").forEach((input) => {
    input.addEventListener("change", recalcularTotales);
  });
  document
    .getElementById("otrosTributos")
    .addEventListener("change", recalcularTotales);
});
