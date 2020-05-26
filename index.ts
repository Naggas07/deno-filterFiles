import { readCSVObjects } from "https://deno.land/x/csv/mod.ts";
import files from "./process/createFIles.ts";
import normalize from "./process/funtions.ts";
import YP from "./process/YPprocess.ts";
import YMYR from "./process/YMYRprocess.ts";
import comodines from "./process/comProcess.ts";

const f = await Deno.open(`./input/ObjetoName.csv`);

let lines = [];
let yp = "";
let erroryp = "";
let historicDate = files.historialDate();

//create folder sistem if not exist
Deno.mkdir("./output", { recursive: true });
Deno.mkdir("./input", { recursive: true });
Deno.mkdir("./Historico", { recursive: true });
Deno.mkdir("./Historico/Olders", { recursive: true });
Deno.mkdir("./tratados", { recursive: true });

//day folder
Deno.mkdir(`./output/${historicDate}`, { recursive: true });

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

tarjetas.YPaplazableSinDuplicados.map((line: any) => {
  let textLine = line.join(",");
  yp += `${textLine}\n`;

  let texterror = `${textLine},APLZYP,${historicDate}`;
  erroryp += `${texterror}\n`;
});

const encoder = new TextEncoder();
let data = encoder.encode(yp);

await Deno.writeFile(normalize.routes.APLZYP, data, {
  append: true,
});

data = encoder.encode(erroryp);
await Deno.writeFile(normalize.routes.historial, data, {
  append: true,
});

//aplazaYMYR
const YmYr = await YMYR.procesoYMYR(correctsContrat);

await files.createFile(normalize.archiveName.APLZYMYR, "csv");

header = await files.cabeceraNifContrato();
await Deno.writeFile(normalize.routes.APLZYMYR, header, {
  append: true,
});

const aplazYM = YmYr.aplazaYMYR.slice(1);
let aplzaYMYR = "";
let historicoYM = "";

aplazYM.map((line: any) => {
  let textLine = line.join(",");
  aplzaYMYR += `${textLine}\n`;

  let texterror = `${textLine},APLZYMYR,${historicDate}`;
  historicoYM += `${texterror}\n`;
});

data = encoder.encode(aplzaYMYR);

await Deno.writeFile(normalize.routes.APLZYMYR, data, {
  append: true,
});

data = encoder.encode(historicoYM);

await Deno.writeFile(normalize.routes.historial, data, {
  append: true,
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

//COMODINES

let comodin = comodines.procesoComodin(correctsContrat, historicDate);

let comodinText = "";
let historialComodin = "";
comodin.tarjetas.map((row: any) => {
  let text = `${row[1]}\n`;
  comodinText += text;
});

if (comodinText.length > 0) {
  await files.createFile(normalize.archiveName.comodin, "csv");

  data = encoder.encode(comodinText);

  Deno.writeFile(normalize.routes.comodin, data, {
    append: true,
  });

  comodin.historico.map((row: any) => {
    let text = `${row}\n`;
    historialComodin += text;
  });

  data = encoder.encode(historialComodin);
  Deno.writeFile(normalize.routes.historial, data, {
    append: true,
  });
}

//BASCULA

let bascula = comodines.procesoBascula(correctsContrat, historicDate);

let bascText = "";
let historialbasc = "";
bascula.tarjetas.map((row: any) => {
  let text = `${row.toString()}\n`;
  bascText += text;
});

if (bascText.length > 0) {
  await files.createFile(normalize.archiveName.bascula, "csv");

  data = encoder.encode(bascText);

  Deno.writeFile(normalize.routes.bascula, data, {
    append: true,
  });

  bascula.historico.map((row: any) => {
    let text = `${row}\n`;
    historialbasc += text;
  });

  data = encoder.encode(historialbasc);
  Deno.writeFile(normalize.routes.historial, data, {
    append: true,
  });
}
//errores de tarjetas

const errorContrat1 = lines
  .filter((line) => !normalize.isContract(line.Contrato1))
  .map((err) => [err.Contrato1, err.nif, err.email, err.hora]);

await files.createFile(normalize.archiveName.error, "csv");

header = await files.cabeceraErrores();
await Deno.writeFile(normalize.routes.ERRORES, header, {
  append: true,
});

let errors = "";

errorContrat1.map((error) => {
  const textLine = error.join(",");
  const errorLine = `${textLine}\n`;

  errors += errorLine;
});

const errorYM = YmYr.errores.slice(1);

errorYM.map((error) => {
  const textLine = error.toString();
  const errorLine = `${textLine}\n`;

  errors += errorLine;
});

data = encoder.encode(errors);

await Deno.writeFile(normalize.routes.ERRORES, data, {
  append: true,
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
