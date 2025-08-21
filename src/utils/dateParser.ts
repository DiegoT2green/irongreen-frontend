export function parseDate(str: string | null): Date {
  const fallback = new Date("2100-01-01"); // fecha dummy futura

  if (!str) return fallback;

  const mesi: Record<string, number> = {
    gennaio: 0, febbraio: 1, marzo: 2, aprile: 3,
    maggio: 4, giugno: 5, luglio: 6, agosto: 7,
    settembre: 8, ottobre: 9, novembre: 10, dicembre: 11,
  };

  const parts = str.split("/");
  if (parts.length !== 3) return fallback;

  const [giorno, meseStr, annoStr] = parts;
  const mese = mesi[meseStr.toLowerCase()];
  const giornoNum = parseInt(giorno, 10);
  const annoNum = parseInt(annoStr.replace(/^0+/, ""), 10);

  if (isNaN(giornoNum) || isNaN(mese) || isNaN(annoNum)) return fallback;

  const date = new Date(annoNum, mese, giornoNum);
  return isNaN(date.getTime()) ? fallback : date;
}
