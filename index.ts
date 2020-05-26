import { readCSVObjects } from "https://deno.land/x/csv/mod.ts";
import files from "./process/createFIles.ts";
import normalize from "./process/funtions.ts";
import YP from "./process/YPprocess.ts";
import YMYR from "./process/YMYRprocess.ts";

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

console.log(errores.length);

//aplazaYP

await files.createFile(normalize.archiveName.APLZYP, "csv");

let header = await files.cabeceraNifContrato();
await Deno.writeFile(normalize.APLZYProute, header, {
  append: true,
});

tarjetas.YPaplazableSinDuplicados.map(async (line: any) => {
  const textLine = line.join(",");
  const encoder = new TextEncoder();
  const data = encoder.encode(`${textLine}\n`);
  await Deno.writeFile(normalize.APLZYProute, data, {
    append: true,
  });
});

//aplazaYMYR
const YmYr = await YMYR.procesoYMYR(correctsContrat);

await files.createFile(normalize.archiveName.APLZYMYR, "csv");

header = await files.cabeceraNifContrato();
await Deno.writeFile(normalize.APLZYMYRroute, header, {
  append: true,
});

const aplazYM = YmYr.aplazaYMYR.slice(1);
console.log(aplazYM);

aplazYM.map((item: any, i: number, global: any) => {
  if (global.indexOf(item) === i) {
    const textLine = item.join(",");
    const encoder = new TextEncoder();
    const data = encoder.encode(`${textLine}\n`);
    Deno.writeFile(normalize.APLZYMYRroute, data, {
      append: true,
    });
  }
});

f.close();

// await Deno.copyFile(
//   `./input/ObjetoName.csv`,
//   `./tratados/tratado_${files.createToday()}.csv`
// );
// await Deno.remove(`./input/ObjetoName.csv`);
