import files from "../process/createFIles.ts";

const isContract = (contract: string) => {
  if (contract.length != 14) {
    return false;
  } else if (contract.slice(0, 3) != "500") {
    return false;
  } else if (contract.includes(" ")) {
    return true;
  } else {
    return true;
  }
};

const isYP = (contract: string) => {
  return contract[12] === "0" ? true : false;
};

const isYMYR = (contract: string) => {
  return !isYP(contract);
};

const archiveName = {
  APLZYP: "APLZYP",
  APLZYMYR: "APLZYMYR",
  APLZx2YMYR: "APLZx2YMYR",
  error: "ERRORES",
  comodin: "COMODIN",
  bascula: "BASCULA",
};

const routes = {
  APLZYP: `./output/${files.historialDate()}/${
    archiveName.APLZYP
  }_${files.createToday()}.csv`,
  APLZx2YMYR: `./output/${files.historialDate()}/${
    archiveName.APLZx2YMYR
  }_${files.createToday()}.csv`,
  APLZYMYR: `./output/${files.historialDate()}/${
    archiveName.APLZYMYR
  }_${files.createToday()}.csv`,
  historial: "./historico/historico.txt",
  ERRORES: `./output/${files.historialDate()}/${
    archiveName.error
  }_${files.createToday()}.csv`,
  comodin: `./output/${files.historialDate()}/${
    archiveName.comodin
  }_${files.createToday()}.csv`,
  bascula: `./output/${files.historialDate()}/${
    archiveName.bascula
  }_${files.createToday()}.csv`,
};

export default {
  isContract,
  isYMYR,
  isYP,
  archiveName,
  routes,
};
