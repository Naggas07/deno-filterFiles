import normalize from "./funtions.ts";

const procesoComodin = (data: any, day: any) => {
  const tarjetas = data
    .filter((row: any) => normalize.isYP(row.Contrato1))
    .filter((row: any) => {
      return (
        row.option1.includes("(COM1)") ||
        row.options2.includes("(COM1)") ||
        row.options3.includes("(COM1)") ||
        row.options4.includes("(COM1)") ||
        row.options5.includes("(COM1)")
      );
    })
    .map((tarjeta: any) => [tarjeta.nif, tarjeta.Contrato1]);

  const historico = tarjetas.map(
    (item: any) => `${item.toString()},COMODIN,${day}`
  );

  return { tarjetas, historico };
};

const procesoBascula = (data: any, day: any) => {
  const tarjetas = data
    .filter((row: any) => normalize.isYP(row.Contrato1))
    .filter((row: any) => {
      return (
        row.option1.includes("(BAS)") ||
        row.options2.includes("(BAS)") ||
        row.options3.includes("(BAS)") ||
        row.options4.includes("(BAS)") ||
        row.options5.includes("(BAS)")
      );
    })
    .map((tarjeta: any) => [tarjeta.nif, tarjeta.Contrato1]);

  const historico = tarjetas.map(
    (item: any) => `${item.toString()},BASCULA,${day}`
  );

  return { tarjetas, historico };
};

export default {
  procesoBascula,
  procesoComodin,
};
