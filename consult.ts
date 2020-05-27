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
} else {
  buf = new Uint8Array(1024);
  console.info("Introduce el número de nif:");
  const n = await Deno.stdin.read(buf);
  if (!n) {
    console.log("Standard input closed");
  } else {
    nif = new TextDecoder().decode(buf.subarray(0, n)).trim();
  }
}

// leemos historico

const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile("./Historico/historico.txt");
let text = decoder
  .decode(data)
  .split("\n")
  .map((item: any) => item.split(","))
  .map((item: any) => {
    return {
      nif: item[0],
      contrato: item[1],
      solicitud: item[2],
      fechaTamitacion: item[3],
    };
  });

// consultamos

if (contrato != "") {
  let mismoContrato = text.filter((item: any) => item.contrato == contrato);
  console.log(mismoContrato);
} else {
  let mismoNif = text.filter((item: any) => item.nif == nif);
  console.log(mismoNif);
}

console.log("fin del programa!");
