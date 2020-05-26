import normalize from "./funtions.ts";

const procesoTarjeta = async (datosTotales: any) => {
  const tarjetas = datosTotales.filter((line: any) =>
    normalize.isYP(line.Contrato1)
  );

  const YPaplazables = tarjetas.filter((tarjeta: any) =>
    tarjeta.option1.includes("(APLZ)") || tarjeta.options2.includes("(APLZ)") ||
    tarjeta.options3.includes("(APLZ)") ||
    tarjeta.options4.includes("(APLZ)") ||
    tarjeta.options5.includes("(APLZ)")
  ).map((tarjeta: any) => {
    return [tarjeta.nif, tarjeta.Contrato1];
  });

  const YPaplazableSinDuplicados = YPaplazables.filter((
    line: any,
    i: number,
    global: any,
  ) => global.indexOf(line) === i);

  return { tarjetas, YPaplazables, YPaplazableSinDuplicados };
};

export default { procesoTarjeta };
