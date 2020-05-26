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
};

const APLZYProute = `./output/${archiveName.APLZYP}_${files.createToday()}.csv`;
const APLZYMYRroute = `./output/${
  archiveName.APLZYMYR
}_${files.createToday()}.csv`;
const APLZx2YMYRroute = `./output/${
  archiveName.APLZx2YMYR
}_${files.createToday()}.csv`;

export default {
  isContract,
  isYMYR,
  isYP,
  archiveName,
  APLZx2YMYRroute,
  APLZYMYRroute,
  APLZYProute,
};
