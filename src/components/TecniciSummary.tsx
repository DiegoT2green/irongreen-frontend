import { useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse, format } from "date-fns";
import { it } from "date-fns/locale";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

function ConfirmationModal({ isOpen, onClose, onConfirm, message }: ConfirmationModalProps) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed top-0 left-0 w-full min-h-screen h-full bg-black/70 flex items-center justify-center z-50"
      style={{ margin: 0 }}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{message}</h3>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-violet-700 hover:bg-violet-800 text-white rounded-md"
          >
            Conferma
          </button>
        </div>
      </div>
    </div>
  );
}

type Rapport = {
  codice: number;
  descrizione: string;
  tecnico: string;
  effort: string;
  data: string;
};

type Sottocommessa = {
  codice: number;
  descrizione: string;
  rapport: Rapport[];
};

type Commessa = {
  codice: string;
  descrizione: string;
  sottocommesse: Sottocommessa[];
};

type Activity = {
  tecnico: string;
  effort: number;
  data: string;
  dateObj: Date;
  descrizione: string;
  commessa: string;
  sottocommessa: string;
};

export default function TecniciSummary() {
  const [commesse, setCommesse] = useState<Commessa[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [showTecniciDropdown, setShowTecniciDropdown] = useState(false);
  const [showCommesseDropdown, setShowCommesseDropdown] = useState(false);
  const [filterTecniciText, setFilterTecniciText] = useState("");
  const [filterCommesseText, setFilterCommesseText] = useState("");

  const [selectedTecnici, setSelectedTecnici] = useState<string[]>([]);
  const [selectedCommesse, setSelectedCommesse] = useState<string[]>([]);

  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    fetch("http://cosvm12.coversystem.it:4000/api/commesse")
      .then((res) => res.json())
      .then((data) => {
        setCommesse(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore nel caricamento:", err);
        setLoading(false);
      });
  }, []);

  const allActivities = useMemo(() => {
    const activities: Activity[] = [];
    commesse.forEach((commessa) => {
      commessa.sottocommesse?.forEach((sottocommessa) => {
        sottocommessa.rapport?.forEach((rapport) => {
          if (!rapport.tecnico) return;
          try {
            const dateObj = parse(rapport.data, "dd/MM/yyyy", new Date());
            activities.push({
              tecnico: rapport.tecnico,
              effort: parseFloat(rapport.effort.replace(",", ".")),
              data: rapport.data,
              dateObj,
              descrizione: rapport.descrizione,
              commessa: commessa.codice,
              sottocommessa: sottocommessa.descrizione,
            });
          } catch {
            // Ignorar error en parsing
          }
        });
      });
    });
    return activities.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
  }, [commesse]);

  // Filtrado por fechas, técnicos y commesse seleccionadas
  const filteredActivities = useMemo(() => {
    return allActivities.filter((a) => {
      if (startDate && a.dateObj < startDate) return false;
      if (endDate && a.dateObj > endDate) return false;
      if (selectedTecnici.length > 0 && !selectedTecnici.includes(a.tecnico)) return false;
      if (selectedCommesse.length > 0 && !selectedCommesse.includes(a.commessa)) return false;
      return true;
    });
  }, [allActivities, startDate, endDate, selectedTecnici, selectedCommesse]);

  const tecniciData = useMemo(() => {
    const grouped: Record<string, Activity[]> = {};
    filteredActivities.forEach((a) => {
      if (!grouped[a.tecnico]) grouped[a.tecnico] = [];
      grouped[a.tecnico].push(a);
    });
    return grouped;
  }, [filteredActivities]);

  const stats = useMemo(() => {
    const totalHours = filteredActivities.reduce((sum, a) => sum + a.effort, 0);
    const uniqueTechnicians = new Set(filteredActivities.map((a) => a.tecnico)).size;
    const uniqueProjects = new Set(filteredActivities.map((a) => a.commessa)).size;
    return {
      totalHours: totalHours.toFixed(1),
      totalActivities: filteredActivities.length,
      uniqueTechnicians,
      uniqueProjects,
    };
  }, [filteredActivities]);

  // Listas únicas para mostrar en filtros
  const uniqueTecnici = useMemo(() => {
    const setTecnici = new Set(allActivities.map((a) => a.tecnico));
    return Array.from(setTecnici).sort((a, b) => a.localeCompare(b));
  }, [allActivities]);

  const uniqueCommesse = useMemo(() => {
    const setCommesse = new Set(allActivities.map((a) => a.commessa));
    return Array.from(setCommesse).sort((a, b) => a.localeCompare(b));
  }, [allActivities]);

  // Funciones para seleccionar/deseleccionar todo en filtros
  const toggleSelectAllTecnici = () => {
    if (selectedTecnici.length === uniqueTecnici.length) {
      setSelectedTecnici([]);
    } else {
      setSelectedTecnici(uniqueTecnici);
    }
  };

  const toggleSelectAllCommesse = () => {
    if (selectedCommesse.length === uniqueCommesse.length) {
      setSelectedCommesse([]);
    } else {
      setSelectedCommesse(uniqueCommesse);
    }
  };

  // Función para exportar
  function exportToExcel() {
    const wb = XLSX.utils.book_new();

    const generalData = filteredActivities.map((a) => ({
      Tecnico: a.tecnico,
      Data: a.data,
      Descrizione: a.descrizione,
      Commessa: a.commessa,
      Sottocommessa: a.sottocommessa,
      Ore: a.effort,
    }));
    const wsGeneral = XLSX.utils.json_to_sheet(generalData);
    XLSX.utils.book_append_sheet(wb, wsGeneral, "Attività filtrate");

    Object.entries(tecniciData).forEach(([tecnico, attività]) => {
      const data = attività.map((a) => ({
        Data: a.data,
        Descrizione: a.descrizione,
        Commessa: a.commessa,
        Sottocommessa: a.sottocommessa,
        Ore: a.effort,
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, tecnico.substring(0, 31));
    });

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, `attivita_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  if (loading) return <p className="p-4">Caricamento...</p>;

  return (
    <div className="p-6 min-h-screen space-y-6 max-w-7xl mx-auto">
      {/* Filtros */}
      <div className="bg-white border rounded-xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block font-semibold text-[#2a4d50] mb-1">📅 Dal</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Data iniziale"
            className="border px-3 py-2 rounded-md w-full"
            locale={it}
            isClearable
          />
        </div>
        <div>
          <label className="block font-semibold text-[#2a4d50] mb-1">📅 Al</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Data finale"
            className="border px-3 py-2 rounded-md w-full"
            locale={it}
            isClearable
          />
        </div>

        {/* Filtro Tecnici */}
        <div className="relative">
          <button
            onClick={() => setShowTecniciDropdown((v) => !v)}
            className="w-full border px-3 py-2 rounded-md bg-white hover:bg-gray-50 text-left"
          >
            <span className="block font-semibold text-[#2a4d50]">👤 Filtra tecnici</span>
            <span
              className="text-xs text-gray-600 truncate block max-w-[calc(100% - 2rem)]"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {selectedTecnici.length === 0
                ? "Tutti i tecnici"
                : selectedTecnici.join(", ")}
            </span>
          </button>

          {showTecniciDropdown && (
            <div className="absolute z-30 mt-1 w-full bg-white border rounded-md shadow-lg max-h-64 overflow-y-auto">
              <div className="p-2 border-b">
                <input
                  type="text"
                  placeholder="Cerca tecnico"
                  className="w-full px-2 py-1 text-sm border rounded"
                  value={filterTecniciText}
                  onChange={(e) => setFilterTecniciText(e.target.value)}
                />
              </div>
              <ul className="max-h-40 overflow-y-auto text-sm">
                {uniqueTecnici
                  .filter((t) => t.toLowerCase().includes(filterTecniciText.toLowerCase()))
                  .map((tecnico) => (
                    <li
                      key={tecnico}
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      onClick={() => {
                        if (selectedTecnici.includes(tecnico)) {
                          setSelectedTecnici(selectedTecnici.filter((v) => v !== tecnico));
                        } else {
                          setSelectedTecnici([...selectedTecnici, tecnico]);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTecnici.includes(tecnico)}
                        readOnly
                        tabIndex={-1}
                      />
                      <label>{tecnico}</label>
                    </li>
                  ))}
              </ul>

              <div className="flex justify-between px-3 py-2 border-t text-sm">
              <button
                onClick={toggleSelectAllTecnici}
                className={`hover:underline cursor-pointer ${
                  selectedTecnici.length === uniqueTecnici.length ? "text-red-600" : "text-green-600"
                }`}
              >
                {selectedTecnici.length === uniqueTecnici.length ? "Deseleziona tutto" : "Seleziona tutto"}
              </button>

              </div>
            </div>
          )}
        </div>

        {/* Filtro Commesse */}
        <div className="relative">
          <button
            onClick={() => setShowCommesseDropdown((v) => !v)}
            className="w-full border px-3 py-2 rounded-md bg-white hover:bg-gray-50 text-left"
          >
            <span className="block font-semibold text-[#2a4d50]">📋 Filtra commesse</span>
            <span
              className="text-xs text-gray-600 truncate block max-w-[calc(100% - 2rem)]"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {selectedCommesse.length === 0
                ? "Tutte le commesse"
                : selectedCommesse.join(", ")}
            </span>

          </button>

          {showCommesseDropdown && (
            <div className="absolute z-30 mt-1 w-full bg-white border rounded-md shadow-lg max-h-64 overflow-y-auto">
              <div className="p-2 border-b">
                <input
                  type="text"
                  placeholder="Cerca codice o nome"
                  className="w-full px-2 py-1 text-sm border rounded"
                  value={filterCommesseText}
                  onChange={(e) => setFilterCommesseText(e.target.value)}
                />
              </div>
                <ul className="max-h-40 overflow-y-auto text-sm">
                  {uniqueCommesse
                    .filter((c) => c.toLowerCase().includes(filterCommesseText.toLowerCase()))
                    .map((commessa) => (
                      <li
                        key={commessa}
                        className="px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          if (selectedCommesse.includes(commessa)) {
                            setSelectedCommesse(selectedCommesse.filter((v) => v !== commessa));
                          } else {
                            setSelectedCommesse([...selectedCommesse, commessa]);
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCommesse.includes(commessa)}
                          readOnly
                          tabIndex={-1}
                        />
                        <label>{commessa}</label>
                      </li>
                    ))}
                </ul>

              <div className="flex justify-between px-3 py-2 border-t text-sm">
              <button
                onClick={toggleSelectAllCommesse}
                className={`hover:underline cursor-pointer ${
                  selectedCommesse.length === uniqueCommesse.length ? "text-red-600" : "text-green-600"
                }`}
              >
                {selectedCommesse.length === uniqueCommesse.length ? "Deseleziona tutto" : "Seleziona tutto"}
              </button>


              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botón de exportación y estadísticas */}
      <div className="flex justify-between items-center">
        {/* Resumen estadístico */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 mr-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Ore totali</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.totalHours} h</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Attività</h3>
            <p className="text-2xl font-bold text-green-600">{stats.totalActivities}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Tecnici</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.uniqueTechnicians}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Commesse</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.uniqueProjects}</p>
          </div>
        </div>

        {/* Botón de exportación */}
        <button
          onClick={() => setShowExportModal(true)}
          className="bg-violet-800 hover:bg-violet-700 text-white px-4 py-3 rounded-lg transition flex items-center space-x-2 h-full"
        >
          <span>📥</span>
          <span>Esporta in Excel</span>
        </button>
      </div>

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={() => {
          exportToExcel();
          setShowExportModal(false);
        }}
        message={`Stai per esportare ${filteredActivities.length} attività in un file Excel. Vuoi procedere?`}
      />

      {/* Lista tecnici */}
      {Object.entries(tecniciData).length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500 text-lg">Nessun risultato trovato con i filtri attuali</p>
          <button
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
              setSelectedTecnici([]);
              setSelectedCommesse([]);
            }}
            className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
          >
            Reset filtri
          </button>
        </div>
      ) : (
        Object.entries(tecniciData).map(([tecnico, attività]) => {
          const total = attività.reduce((sum, a) => sum + a.effort, 0).toFixed(2);

          return (
            <div
              key={tecnico}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="bg-[#2a4d50] px-5 py-3">
                <h3 className="text-xl font-bold text-white">{tecnico}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-white/90 mt-1">
                  <span>🕒 <strong>{total} h</strong> lavorate</span>
                  <span>📋 <strong>{attività.length}</strong> attività</span>
                  <span>📅 Da {format(attività[attività.length - 1].dateObj, "dd/MM/yyyy")} a {format(attività[0].dateObj, "dd/MM/yyyy")}</span>
                </div>
              </div>

              <ul className="divide-y divide-gray-100">
                {attività.map((a, i) => (
                  <li key={i} className="px-5 py-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-gray-700">{a.data}</span>
                        <p className="text-gray-600">{a.descrizione}</p>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2">
                            {a.commessa}
                          </span>
                          <span className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            {a.sottocommessa}
                          </span>
                        </div>
                      </div>
                      <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-sm font-medium">
                        {a.effort}h
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
}
