import normalize from "./funtions.ts";
import files from "./createFIles.ts";

const date = new Date();

const normalYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const leapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const knowYearDay = (typeYear: any, month: number, day: number) => {
  if (month === 0) {
    return day;
  }
  let monthsPassed = typeYear.slice(0, month);

  let yearDay =
    monthsPassed.reduce((acc: number, monthDays: number) => acc + monthDays) +
    day;
  return yearDay;
};

const dayOfYear = (year: any, month: number, day: number) => {
  let days: number;
  if (year % 4 === 0) {
    days = knowYearDay(leapYear, month, day);
  } else {
    days = knowYearDay(normalYear, month, day);
  }

  return days;
};

console.log("Dia del año", dayOfYear(2019, 3, 15));
console.log("Dia de la semana", date.getDay());

const dosCaracteres = (number: number) => {
  return number < 10 ? "0" + number : number;
};

const diaCarpeta = (year: number, day: number) => {
  const fecha = new Date(year, 0, day);

  return `${dosCaracteres(fecha.getDate())}-${dosCaracteres(
    fecha.getMonth() + 1
  )}-${year}`;
};

const diaFichero = (year: number, day: number) => {
  const fecha = new Date(year, 0, day);

  return `${year}${dosCaracteres(fecha.getMonth() + 1)}${dosCaracteres(
    fecha.getDate()
  )}`;
};

const yearDate = dayOfYear(date.getFullYear(), date.getMonth(), date.getDate());

if (date.getDay() === 4) {
  //creamos fichero acumulado
  // await files.createFile(normalize.archiveName.acumBascula, "txt");

  // let header = await files.cabeceraNifContrato();
  // await Deno.writeFile(normalize.routes.basculaSemanal, header, {
  //   append: true,
  // });

  let output = await Deno.readDir("./output/");
  let folders = [];
  for await (const folder of output) {
    for (let i = 0; i < 7; i++) {
      if (yearDate - i < 0) {
        let lastYearDate =
          date.getFullYear() % 4 === 0
            ? 366 - (yearDate - i)
            : 365 - (yearDate - i);

        if (folder.name === diaCarpeta(date.getFullYear() - 1, lastYearDate)) {
          folders.push(folder.name);
        }
      } else {
        if (folder.name === diaCarpeta(date.getFullYear(), yearDate - i)) {
          folders.push(folder.name);
        }
      }
    }
  }

  console.log(folders);

  let dato = folders
    .map((item: any) => `./output/${item}/`)
    .map((item: any) => {
      for await (const dirEntry of Deno.readDir(item)) {
        return dirEntry.name;
      }
    });

  console.log("DIOSOOSOS", dato);

  let archivo = await Deno.readFile("./output/27-05-2020/ERRORES_20200527.csv");
  let text = new TextDecoder().decode(archivo).trim().split("\n");
  let arr = text
    .map((line: any) => line.split(","))
    .map((line: any) => {
      return {
        contrato: line[0],
        nif: line[1],
        email: line[2],
        fecha: line[3],
      };
    })
    .slice(1);

  console.log(arr);

  let archive = [];
  for (let i = 0; i < 7; i++) {}

  console.log(await Deno.readDir("./output/26-05-2020/"));
  for await (const dirEntry of Deno.readDir("./output/26-05-2020/")) {
    console.log(dirEntry);
    if (dirEntry.name.includes("COMODIN")) {
      archive.push(`./output/26-05-2020/COMODIN_20200526.csv`);
    }
  }

  console.log(archive);
}
