import files from "./createFIles.ts";

const createFile = async (name: string, extension: string) => {
  const file = await Deno.create(
    `./output/${files.historialDate()}/${name}_${createToday()}.${extension}`
  );

  return file;
};

const cabeceraErrores = () => {
  const encoder = new TextEncoder();
  const header = encoder.encode(`Contrato,NIF,email,dia\n`);

  return header;
};

const createToday = () => {
  const today = new Date();

  const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
  const month =
    today.getMonth() <= 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;

  return `${today.getFullYear()}${month}${day}`;
};

const cabeceraNifContrato = async () => {
  const encoder = new TextEncoder();
  const header = encoder.encode(`NIF,Contrato\n`);

  return header;
};

const historialDate = () => {
  const today = new Date();

  const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
  const month =
    today.getMonth() <= 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;

  return `${day}-${month}-${today.getFullYear()}`;
};

export default {
  createFile,
  createToday,
  cabeceraNifContrato,
  historialDate,
  cabeceraErrores,
};
