import { readCSVObjects } from "https://deno.land/x/csv/mod.ts";
import files from "./process/createFIles.ts";
import normalize from "./process/funtions.ts";
import YP from "./process/YPprocess.ts";
import YMYR from "./process/YMYRprocess.ts";

const f = await Deno.open(`./input/ObjetoName.csv`);

let lines = [];
let historicDate = files.historialDate();
let errores = [];

for await (const obj of readCSVObjects(f)) {
  lines.push(obj);
}

const correctsContrat = lines.filter((line) =>
  normalize.isContract(line.Contrato1)
);

const tarjetas = await YP.procesoTarjeta(lines);

//aplazaYP

await files.createFile(normalize.archiveName.APLZYP, "csv");

let header = await files.cabeceraNifContrato();
await Deno.writeFile(normalize.routes.APLZYP, header, {
  append: true,
});

tarjetas.YPaplazableSinDuplicados.map(async (line: any) => {
  const textLine = line.join(",");
  const encoder = new TextEncoder();
  const data = encoder.encode(`${textLine}\n`);

  await Deno.writeFile(normalize.routes.APLZYP, data, {
    append: true,
  });

  const textHistoric = `${textLine},APLZYP,${historicDate}`;
  const historicData = encoder.encode(`${textHistoric}\n`);
  Deno.writeFile(normalize.routes.historial, historicData, {
    append: true,
  });
});

//aplazaYMYR
const YmYr = await YMYR.procesoYMYR(correctsContrat);

await files.createFile(normalize.archiveName.APLZYMYR, "csv");

header = await files.cabeceraNifContrato();
await Deno.writeFile(normalize.routes.APLZYMYR, header, {
  append: true,
});

const aplazYM = YmYr.aplazaYMYR.slice(1);

aplazYM.map((item: any, i: number, global: any) => {
  if (global.indexOf(item) === i) {
    const textLine = item.join(",");
    const encoder = new TextEncoder();
    const data = encoder.encode(`${textLine}\n`);

    Deno.writeFile(normalize.routes.APLZYMYR, data, {
      append: true,
    });

    const textHistoric = `${textLine},APLZYM,${historicDate}`;
    const historicData = encoder.encode(`${textHistoric}\n`);
    Deno.writeFile(normalize.routes.historial, historicData, {
      append: true,
    });
  }
});

//APLZ x2

await files.createFile(normalize.archiveName.APLZx2YMYR, "csv");

header = await files.cabeceraNifContrato();
await Deno.writeFile(normalize.routes.APLZx2YMYR, header, {
  append: true,
});

const aplazYMx2 = YmYr.aplazax2YMYR.slice(1);

aplazYMx2.map((item: any, i: number, global: any) => {
  if (global.indexOf(item) === i) {
    const textLine = item.join(",");
    const encoder = new TextEncoder();
    const data = encoder.encode(`${textLine}\n`);

    Deno.writeFile(normalize.routes.APLZx2YMYR, data, {
      append: true,
    });

    const textHistoric = `${textLine},APLZYMx2,${historicDate}`;
    const historicData = encoder.encode(`${textHistoric}\n`);
    Deno.writeFile(normalize.routes.historial, historicData, {
      append: true,
    });
  }
});

f.close();

await Deno.copyFile(
  `./input/ObjetoName.csv`,
  `./tratados/tratado_${files.createToday()}.csv`
);
await Deno.copyFile(
  `./Historico/historico.txt`,
  `./Historico/Olders/historico_${files.createToday()}.txt`
);
await Deno.remove(`./input/ObjetoName.csv`);
