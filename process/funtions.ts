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

export default { isContract, isYMYR, isYP };
