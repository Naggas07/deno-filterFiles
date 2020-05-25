import { writeCSVObjects } from "https://deno.land/x/csv/mod.ts";

const createFile = async (name: string, extension: string) => {
  const file = await Deno.create(
    `./output/${name}_${createToday()}.${extension}`,
  );

  return file;
};

const createToday = () => {
  const today = new Date();

  const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
  const month = today.getMonth() <= 10
    ? `0${today.getMonth() + 1}`
    : today.getMonth() + 1;

  return `${today.getFullYear()}${month}${day}`;
};

export default { createFile, createToday };
