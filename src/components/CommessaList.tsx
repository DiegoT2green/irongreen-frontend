import { useEffect, useRef, useState } from "react";
import type { Commessa } from "../types";
import CommessaRow from "./CommessaRow";


function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function enrichCommesse(commesse: Commessa[]): Commessa[] {
  return commesse.map((commessa) => {
    const figli = commessa.sottocommesse ?? [];

    const scheduledEffort = figli.reduce((sum, s) => sum + (s.scheduledEffort || 0), 0);

    const actualEffort = figli.reduce((sum, s) => {
      if (typeof s.actualEffort === "number") return sum + s.actualEffort;
      if (typeof s.actualEffort === "string") {
        const parts = s.actualEffort.split(".");
        const hours = parts.reduce((acc, val) => acc + parseFloat(val || "0"), 0);
        return sum + hours;
      }
      return sum;
    }, 0);

    const deltaEffort = scheduledEffort - actualEffort;

    const completions = figli
      .map((s) =>
        s.scheduledEffort > 0
          ? Math.min(
              100,
              ((typeof s.actualEffort === "number"
                ? s.actualEffort
                : parseFloat((s.actualEffort as string).replaceAll(".", "")) / 100) /
                s.scheduledEffort) *
                100
            )
          : 0
      )
      .filter((n) => !isNaN(n));

    const pctCompleteMedia =
      completions.length > 0
        ? Math.round(completions.reduce((a, b) => a + b, 0) / completions.length)
        : 0;

    const giorniTotali = scheduledEffort > 0 ? Math.ceil(scheduledEffort / 8) : 0;

    const stato = commessa.stato ?? "Non specificato";

    return {
      ...commessa,
      nome: commessa.descrizione,
      dataInizio: commessa.scheduledStart,
      dataFine: commessa.scheduledFinish,
      effortScheduled: scheduledEffort,
      effortActual: Math.round(actualEffort * 100) / 100,
      effortDelta: Math.round(deltaEffort * 100) / 100,
      pctCompleteMedia,
      figli,
      giorniTotali,
      stato,
    };
  });
}

export default function CommessaList() {
  const [commesse, setCommesse] = useState<Commessa[]>([]);
  const [loading, setLoading] = useState(true);
  const [esclusi, setEsclusi] = useState<string[]>(["0005", "0006", "0007", "0009", "0090", "0091", "T2_00", "BG.ND", "BG.00"]);
  const [menuAperto, setMenuAperto] = useState(false);
  const [search, setSearch] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/commesse")
      .then((res) => res.json())
      .then((data) => {
        const enriched = enrichCommesse(data);
        setCommesse(enriched);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore nel caricamento:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAperto(false);
      }
    };
    if (menuAperto) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuAperto]);

  const toggleCodice = (codice: string) => {
    setEsclusi((prev) =>
      prev.includes(codice)
        ? prev.filter((c) => c !== codice)
        : [...prev, codice]
    );
  };

  const commesseFiltrate = commesse.filter((c) => {
    const codice = normalizeString(c.codice);
    const descrizione = normalizeString(c.descrizione);
    const filtro = normalizeString(search);

    return (
      !esclusi.includes(c.codice) &&
      (codice.includes(filtro) || descrizione.includes(filtro))
    );
  });

if (loading) {
  return <p>Caricamento in corso...</p>;
}



  return (
<>
      <div className="flex flex-wrap gap-3 mb-4 items-center relative" ref={menuRef}>
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <button
            onClick={() => setMenuAperto((prev) => !prev)}
            className="flex items-center gap-2 bg-[#5ecac2] text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition text-sm"
          >
            ⬇️ Filtra Commesse
          </button>
        </div>

        {menuAperto && (
          <div className="absolute left-0 top-full z-50 mt-2 bg-white border border-gray-300 rounded shadow-lg p-3 max-h-80 overflow-y-auto w-64 text-sm">
            <p className="font-medium mb-2 text-[#2a4d50]">Filtra commesse:</p>

            <input
              type="text"
              placeholder="Cerca codice o nome"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-2 px-2 py-1 border border-gray-300 rounded text-xs"
            />

            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
              {commesse.map((c) => (
                <label key={c.codice} className="flex items-center gap-2 text-xs text-[#2a4d50]">
                  <input
                    type="checkbox"
                    checked={!esclusi.includes(c.codice)}
                    onChange={() => toggleCodice(c.codice)}
                    className="accent-[#5ecac2]"
                  />
                  {c.codice} – {c.descrizione}
                </label>
              ))}
            </div>

            <div className="mt-2 flex justify-between text-xs pt-2 border-t border-gray-200">
              <button onClick={() => setEsclusi([])} className="text-green-600 hover:underline">
                Mostra tutto
              </button>
              <button onClick={() => setEsclusi(commesse.map((c) => c.codice))} className="text-red-600 hover:underline">
                Nascondi tutto
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {commesseFiltrate.map((commessa) => (
          <CommessaRow key={commessa.codice} commessa={commessa} />
        ))}
      </div>
</>
  );
}