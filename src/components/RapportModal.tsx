import type { Sottocommessa } from "../types";

interface Props {
  sottocommesa: Sottocommessa;
  onClose: () => void;
}

export default function RapportModal({ sottocommesa, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#d4f4ef] text-[#2a4d50] rounded-lg shadow-xl border border-[#5ecac2] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4 relative text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cierre */}
        <button
          aria-label="Chiudi"
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow transition"
        >
          X
        </button>

        <h2 className="text-sm font-semibold mb-3 pr-10">
          Codice CF: ({sottocommesa.codice}) — Attività per: <span className="italic">{sottocommesa.descrizione}</span>
        </h2>

        {sottocommesa.rapport && sottocommesa.rapport.length > 0 ? (
          <table className="w-full text-xs border border-[#5ecac2]">
            <thead className="bg-[#5ecac2] text-[#2a4d50]">
              <tr>
                <th className="p-1 border border-[#5ecac2]">Codice</th>
                <th className="p-1 border border-[#5ecac2]">Descrizione</th>
                <th className="p-1 border border-[#5ecac2]">Tecnico</th>
                <th className="p-1 border border-[#5ecac2]">Effort</th>
                <th className="p-1 border border-[#5ecac2]">Data</th>
              </tr>
            </thead>
            <tbody>
              {sottocommesa.rapport.map((r, i) => (
                <tr key={`${r.codice}-${i}`} className="hover:bg-[#c1eae3]">
                  <td className="p-1 border border-[#5ecac2]">{r.codice}</td>
                  <td className="p-1 border border-[#5ecac2]">{r.descrizione}</td>
                  <td className="p-1 border border-[#5ecac2]">{r.tecnico}</td>
                  <td className="p-1 border border-[#5ecac2] whitespace-nowrap">{r.effort} h</td>
                  <td className="p-1 border border-[#5ecac2]">{r.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-[#2a4d50] mt-2">Nessuna attività disponibile.</p>
        )}
      </div>
    </div>
  );
}
