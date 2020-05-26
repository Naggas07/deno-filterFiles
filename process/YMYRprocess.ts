import normalize from "./funtions.ts";

const procesoYMYR = async (datos: any) => {
  let aplazaYMYR = [String];
  let aplazax2YMYR = [String];
  let errores = [String];

  const camposYMYRrevision = [
    ["Contrato2", "optionContrato2"],
    ["Contrato3", "optionContrato3"],
    ["Contrato4", "optionContrato4"],
    ["Contrato5", "optionContrato5"],
  ];

  await procesoContratoPrincipal(datos, aplazaYMYR, aplazax2YMYR);

  camposYMYRrevision.map((contrato) => {
    procesoOtrosContratos(
      datos,
      contrato[0],
      contrato[1],
      aplazaYMYR,
      aplazax2YMYR,
      errores
    );
  });

  return { aplazaYMYR, aplazax2YMYR, errores };
};

const procesoContratoPrincipal = async (
  dato: any,
  aplz: any[],
  aplzx2: any[]
) => {
  const validos = dato
    .filter((line: any) => normalize.isYMYR(line.Contrato1))
    .filter((line: any) => normalize.isContract(line.Contrato1));

  //aplaza una vez
  validos
    .filter(
      (contrato: any) =>
        contrato.option1.includes("(APLZ)") ||
        contrato.options2.includes("(APLZ)") ||
        contrato.options3.includes("(APLZ)") ||
        contrato.options4.includes("(APLZ)") ||
        contrato.options5.includes("(APLZ)") ||
        contrato.optionContrato2.includes("(APLZ)")
    )
    .map((ok: any) => {
      aplz.push([ok.nif, ok.Contrato1]);
      return;
    });

  //aplazablesx2

  validos
    .filter((contrato: any) => contrato.optionContrato2.includes("(APLZx2)"))
    .map((ok: any) => {
      aplzx2.push([ok.nif, ok.Contrato1]);
      return;
    });
};

const procesoOtrosContratos = (
  dato: any,
  contrato: string,
  campoRevision: string,
  aplz: any[],
  aplzx2: any[],
  error: any[]
) => {
  dato
    .filter((line: any) => !normalize.isContract(line[`${contrato}`]))
    .map((ko: any) => {
      ko[`${contrato}`].length > 0
        ? error.push([ko[`${contrato}`], ko.nif, ko.email, ko.hora])
        : "";

      return;
    });

  const validos = dato
    .filter((line: any) => normalize.isYMYR(line[`${contrato}`]))
    .filter((line: any) => normalize.isContract(line[`${contrato}`]));

  //aplazan 1 vez

  validos
    .filter((line: any) => line[`${campoRevision}`].includes("(APLZ)"))
    .map((ok: any) => {
      aplz.push([ok.nif, ok[`${contrato}`]]);
      return;
    });

  //aplazan x2
  validos
    .filter((line: any) => line[`${campoRevision}`].includes("(APLZx2)"))
    .map((ok: any) => {
      aplzx2.push([ok.nif, ok[`${contrato}`]]);
      return;
    });
};

export default { procesoYMYR };
