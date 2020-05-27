let queEs = "";
let contrato = "";
let nif = "";

let buf = new Uint8Array(1024);

console.warn("Es un contrato?");
const n = await Deno.stdin.read(buf);
if (!n) {
  console.log("Standard input closed");
} else {
  queEs = new TextDecoder().decode(buf.subarray(0, n)).trim();
}

buf = new Uint8Array(1024);
if (queEs === "S" || queEs === "SI" || queEs === "s" || queEs === "si") {
  buf = new Uint8Array(1024);
  console.info("Introduce el número de contrato:");
  const n = await Deno.stdin.read(buf);
  if (!n) {
    console.log("Standard input closed");
  } else {
    contrato = new TextDecoder().decode(buf.subarray(0, n)).trim();
  }
  console.log("contrato:", contrato);
} else {
  buf = new Uint8Array(1024);
  console.info("Introduce el número de nif:");
  const n = await Deno.stdin.read(buf);
  if (!n) {
    console.log("Standard input closed");
  } else {
    nif = new TextDecoder().decode(buf.subarray(0, n)).trim();
  }
  console.log("nif:", nif);
}
