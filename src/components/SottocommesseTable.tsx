import { useState } from "react";
import type { Sottocommessa } from "../types";
import RapportModal from "./RapportModal";

interface Props {
  sottocommesse: Sottocommessa[];
}

export default function SottocommesseTable({ sottocommesse }: Props) {
  const [selected, setSelected] = useState<Sottocommessa | null>(null);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs text-left border border-[#5ecac2] rounded-lg overflow-hidden">
          <thead className="bg-[#5ecac2] text-[#2a4d50]">
            <tr>
              <th className="p-1 border border-[#5ecac2] whitespace-nowrap">CODE</th>
              <th className="p-1 border border-[#5ecac2]">DESCRIPTION</th>
              <th className="p-1 border border-[#5ecac2]">OWNER</th>
              <th className="p-1 border border-[#5ecac2]">DURATION</th>
              <th className="p-1 border border-[#5ecac2]">SHED. EFFORT</th>
              <th className="p-1 border border-[#5ecac2]">REAL EFFORT</th>
              <th className="p-1 border border-[#5ecac2]">Δ HOURS</th>
              <th className="p-1 border border-[#5ecac2]">% COMPL.</th>
              <th className="p-1 border border-[#5ecac2]">SHED. START</th>
              <th className="p-1 border border-[#5ecac2]">SHED. END</th>
              <th className="p-1 border border-[#5ecac2]">REAL START</th>
              <th className="p-1 border border-[#5ecac2]">REAL END </th>
              <th className="p-1 border border-[#5ecac2]">LAST. UPDATE.</th>
              <th className="p-1 border border-[#5ecac2]">Δ  DAYS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d1f2eb] bg-white">
            {sottocommesse.map((s) => (
              <tr
                key={s.codice}
                className="hover:bg-[#e0faf5] cursor-pointer transition"
                onClick={() => setSelected(s)}
              >
                <td className="p-1 whitespace-nowrap font-bold">{s.codice}</td>
                <td className="p-1 font-bold">{s.descrizione}</td>
                <td className="p-1 font-bold">{s.taskOwner || "-"}</td>
                <td className="p-1 text-center font-bold">{s.durataGiorni} days</td>
                <td className="p-1 text-center font-bold">{s.scheduledEffort ?? 0} hrs.</td>
                <td className="p-1 text-center font-bold">{s.actualEffort ?? 0} hrs.</td>
                <td className="p-1 text-center font-bold">{s.deltaEffort ?? 0} hrs.</td>
                <td
                  className={`p-1 font-bold text-center ${
                    (s.pctComplete ?? 0) > 100
                      ? "text-red-600"
                      : (s.pctComplete ?? 0) > 0
                      ? "text-blue-700"
                      : "text-blue-700"
                  }`}
                >
                  {(s.pctComplete ?? 0)}%
                </td>
                <td className="p-1 font-bold">{s.scheduledStart ?? "-"}</td>
                <td className="p-1 font-bold">{s.scheduledFinish ?? "-"}</td>
                <td className="p-1 font-bold">{s.actualStart ?? "-"}</td>
                <td className="p-1 font-bold">{s.actualEnd ?? "-"}</td>
                <td className="p-1 font-bold">{s.lastUpdate ?? "-"}</td>
                <td
                  className={`p-1 text-center font-bold ${
                    typeof s.deltaGiorni === "number" && s.deltaGiorni < 0
                      ? "text-red-600 font-semibold"
                      : ""
                  }`}
                >
                  {s.deltaGiorni ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <RapportModal sottocommesa={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
