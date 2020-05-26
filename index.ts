import { readCSVObjects } from "https://deno.land/x/csv/mod.ts";
import files from "./process/createFIles.ts";
import normalize from "./process/funtions.ts";
import YP from "./process/YPprocess.ts";
import createFiles from "./process/createFIles.ts";

const f = await Deno.open(`./input/ObjetoName.csv`);

let lines = [];
let contratos = [];
let errores = [];

for await (const obj of readCSVObjects(f)) {
  lines.push(obj);
}

const correctsContrat = lines.filter((line) =>
  normalize.isContract(line.Contrato1)
);

const tarjetas = await YP.procesoTarjeta(lines);

// lines.map((row) => console.log(row));
// contratos.map((row) => console.log(row));
// errores.map((row) => console.log(row));

console.log(lines.length);
console.log(correctsContrat.length);
console.log(tarjetas.tarjetas);

await files.createFile("Prueba", "csv");

tarjetas.YPaplazableSinDuplicados.map(async (line: any) => {
  const textLine = line.join(",");
  const encoder = new TextEncoder();
  const data = encoder.encode(`${textLine}\n`);
  await Deno.writeFile(`./output/Prueba_${files.createToday()}.csv`, data, {
    append: true,
  });
});

f.close();

await Deno.copyFile(
  `./input/ObjetoName.csv`,
  `./tratados/tratado_${createFiles.createToday()}.csv`
);
await Deno.remove(`./input/ObjetoName.csv`);
