import { useState } from "react";
import type { Sottocommessa } from "../types";
import RapportModal from "./RapportModal";

interface Props {
  sottocommesa: Sottocommessa;
}

export default function SottocommesaRow({ sottocommesa }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        className="hover:bg-[#f1fdfb] cursor-pointer text-xs transition"
        onClick={() => setOpen(true)}
      >
        <td className="px-2 py-1 text-center border border-[#e0f5f2] whitespace-nowrap">{sottocommesa.codice}</td>
        <td className="px-2 py-1 text-center border border-[#e0f5f2]">{sottocommesa.descrizione}</td>
        <td className="px-2 py-1 text-center border border-[#e0f5f2]">{sottocommesa.taskOwner}</td>
        <td className="px-2 py-1 text-center border border-[#e0f5f2]">{sottocommesa.durataGiorni}</td>
        <td className="px-2 py-1 text-center border border-[#e0f5f2]">{sottocommesa.scheduledEffort}</td>
        <td className="px-2 py-1 text-center border border-[#e0f5f2]">{sottocommesa.actualEffort}</td>
        <td className="px-2 py-1 text-center border border-[#e0f5f2]">{sottocommesa.deltaEffort}</td>
        <td
          className={`px-2 py-1 text-center border border-[#e0f5f2] font-bold ${
            (sottocommesa.pctComplete ?? 0) > 100
              ? "text-red-600"
              : (sottocommesa.pctComplete ?? 0) > 0
              ? "text-green-600"
              : ""
          }`}
        >
          {sottocommesa.pctComplete ?? 0}%
        </td>
        <td className="px-2 py-1 text-center border border-[#e0f5f2]">{sottocommesa.scheduledStart}</td>
        <td className="px-2 py-1 text-center border border-[#e0f5f2]">{sottocommesa.scheduledFinish}</td>
        <td className="px-2 py-1 text-center border border-[#e0f5f2]">{sottocommesa.actualStart || "-"}</td>
        <td className="px-2 py-1 text-center border border-[#e0f5f2]">{sottocommesa.actualEnd ?? "-"}</td>
        <td className="px-2 py-1 text-center border border-[#e0f5f2]">{sottocommesa.lastUpdate || "-"}</td>
        <td
          className={`px-2 py-1 text-center border border-[#e0f5f2] ${
            typeof sottocommesa.deltaGiorni === "number" && sottocommesa.deltaGiorni < 0
              ? "text-red-600 font-semibold"
              : ""
          }`}
        >
          {sottocommesa.deltaGiorni ?? "-"}
        </td>
      </tr>

      {open && (
        <RapportModal
          sottocommesa={sottocommesa}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
