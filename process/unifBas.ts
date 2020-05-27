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

console.log(dayOfYear(2019, 3, 15));
console.log(date.getDay());

if (date.getDay() === 3) {
  //creamos fichero acumulado
  await files.createFile(normalize.archiveName.acumBascula, "txt");

  let header = await files.cabeceraNifContrato();
  await Deno.writeFile(normalize.routes.basculaSemanal, header, {
    append: true,
  });

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

  for (let i = 0; i < 7; i++) {}
}
