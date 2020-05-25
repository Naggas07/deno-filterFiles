import { readCSVObjects } from "https://deno.land/x/csv/mod.ts";
import files from "./process/createFIles.ts";
import normalize from "./process/funtions.ts";

const f = await Deno.open("./input/ObjetoName.csv");

let lines = [];
let contratos = [];
let errores = [];

for await (const obj of readCSVObjects(f)) {
  lines.push(obj);
}

const correctsContrat = lines.filter((line) =>
  normalize.isContract(line.Contrato1)
);

const tarjetas = correctsContrat.filter((line) =>
  normalize.isYP(line.Contrato1)
);

const YPaplazables = tarjetas.filter((tarjeta) =>
  tarjeta.option1.includes("(APLZ)") || tarjeta.options2.includes("(APLZ)") ||
  tarjeta.options3.includes("(APLZ)") || tarjeta.options4.includes("(APLZ)") ||
  tarjeta.options5.includes("(APLZ)")
).map((tarjeta) => {
  return [tarjeta.nif, tarjeta.Contrato1];
});

const YPaplazableSinDuplicados = YPaplazables.filter((line, i, global) =>
  global.indexOf(line) === i
);

// lines.map((row) => console.log(row));
// contratos.map((row) => console.log(row));
// errores.map((row) => console.log(row));

console.log(lines.length);
console.log(correctsContrat.length);
console.log(YPaplazables.length);
console.log(YPaplazableSinDuplicados.length);

await files.createFile("Prueba", "csv");

YPaplazableSinDuplicados.map(async (line) => {
  const textLine = line.join(",");
  const encoder = new TextEncoder();
  const data = encoder.encode(`${textLine}\n`);
  await Deno.writeFile(
    `./output/Prueba_${files.createToday()}.txt`,
    data,
    { append: true },
  );
});

f.close();
