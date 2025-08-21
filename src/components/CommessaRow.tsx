import { useState } from "react";
import type { Commessa } from "../types";
import SottocommesseTable from "./SottocommesseTable";
import ProgressBar from "./ProgressBar";

interface Props {
  commessa: Commessa;
}

export default function CommessaRow({ commessa }: Props) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div
      className="border border-[#5ecac2] rounded-lg shadow-sm bg-[#d1f2eb] text-[#2a4d50] cursor-pointer transition hover:bg-[#c6ebe3]"
      onClick={toggleExpanded}
    >
      <div className="p-4 flex flex-col gap-3 text-sm">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div className="space-y-1">
            <p className="text-lg font-bold text-[#2a4d50] flex items-center gap-2">
              📁 <span className="font-bold">Codice:</span>{" "}
              <span className="font-semibold">{commessa.codice}</span> |{" "}
              <span className="font-bold">Nome:</span>{" "}
              <span className="font-semibold">{commessa.nome}</span>
            </p>
            <p className="text-sm text-[#2a4d50]/90">
              <span className="font-bold">Responsabile:</span>{" "}
              <span className="font-semibold">{commessa.responsabile}</span> |{" "}
              <span className="font-bold">Inizio:</span>{" "}
              <span className="font-semibold">{commessa.dataInizio}</span> |{" "}
              <span className="font-bold">Fine:</span>{" "}
              <span className="font-semibold">{commessa.dataFine}</span> |{" "}
              <span className="font-bold">Stato:</span>{" "}
              <span className="font-semibold italic">{commessa.stato}</span>
            </p>
          </div>

          {/* Indicador */}
          <span className="text-sm text-[#468493] font-medium">
            {expanded ? "▲ Nascondi Sottocommesse" : "▶ Espandi Sottocommesse"}
          </span>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
          <div>
            <span className="font-bold">Totale giorni:</span>{" "}
            <span className="font-semibold ml-1">{commessa.giorniTotali}</span>
          </div>
          <div>
            <span className="font-bold">Scheduled Effort:</span>{" "}
            <span className="font-semibold ml-1">{commessa.effortScheduled} h</span>
          </div>
          <div>
            <span className="font-bold">Actual Effort:</span>{" "}
            <span className="font-semibold ml-1">{commessa.effortActual} h</span>
          </div>
          <div>
            <span className="font-bold">Delta Effort:</span>{" "}
            <span className="font-semibold ml-1">{commessa.effortDelta} h</span>
          </div>
          <div>
            <span className="font-bold">General Complete:</span>{" "}
            <ProgressBar value={commessa.pctCompleteMedia ?? 0} />
          </div>
        </div>
      </div>

      {expanded && (
        <div
          className="bg-white border-t border-[#5ecac2]/30 p-4 rounded-b-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <SottocommesseTable sottocommesse={commessa.figli ?? []} />
        </div>
      )}
    </div>
  );
}
