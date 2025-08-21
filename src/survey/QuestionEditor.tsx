import { useState, useEffect, useId } from "react";
import type { Question, QuestionType } from "./types";

const questionTypes: QuestionType[] = [
  "text",
  "textarea",
  "radio",
  "checkbox",
  "scale",
  "slider"
];

type Props = {
  onAdd: (question: Question) => void;
  existing?: Question;
};

export default function QuestionEditor({ onAdd, existing }: Props) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState<QuestionType>("text");
  const [options, setOptions] = useState<string[]>([]);
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(10);
  const [optionInput, setOptionInput] = useState("");
  const fallbackId = useId();

  // Precargar datos si estamos editando
  useEffect(() => {
    if (existing) {
      setLabel(existing.label);
      setType(existing.type);
      setOptions(existing.options || []);
      setMin(existing.min ?? 1);
      setMax(existing.max ?? 10);
    } else {
      setLabel("");
      setType("text");
      setOptions([]);
      setOptionInput("");
      setMin(1);
      setMax(10);
    }
  }, [existing]);

  const handleAddOption = () => {
    if (optionInput.trim() !== "") {
      setOptions([...options, optionInput.trim()]);
      setOptionInput("");
    }
  };

  const handleSaveQuestion = () => {
    if (!label.trim()) return;

    const id = existing?.id ?? `q${Date.now()}-${fallbackId}`;

    const newQuestion: Question = {
      id,
      label: label.trim(),
      type,
      ...(type === "radio" || type === "checkbox" ? { options } : {}),
      ...(type === "slider" || type === "scale" ? { min, max } : {})
    };

    onAdd(newQuestion);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow space-y-4">
      <h2 className="text-lg font-semibold">
        {existing ? "Modifica una domanda" : "Crea una nuova domanda"}
      </h2>

      {/* Testo della domanda */}
      <div className="space-y-2">
        <label className="block font-medium">Testo della domanda</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>

      {/* Tipo di risposta */}
      <div className="space-y-2">
        <label className="block font-medium">Tipo di risposta</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={type}
          onChange={(e) => setType(e.target.value as QuestionType)}
        >
          {questionTypes.map((qt) => (
            <option key={qt} value={qt}>
              {qt}
            </option>
          ))}
        </select>
      </div>

      {/* Opzioni (radio / checkbox) */}
      {(type === "radio" || type === "checkbox") && (
        <div className="space-y-2">
          <label className="block font-medium">Opzioni</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-grow border rounded px-2 py-1"
              value={optionInput}
              onChange={(e) => setOptionInput(e.target.value)}
            />
            <button
              type="button"
              className="px-3 py-1 bg-[#147a64] text-white rounded"
              onClick={handleAddOption}
            >
              Aggiungi
            </button>
          </div>
          {options.length > 0 && (
            <ul className="list-disc list-inside text-sm text-gray-700">
              {options.map((opt, idx) => (
                <li key={idx}>{opt}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Slider / Scale */}
      {(type === "slider" || type === "scale") && (
        <div className="flex gap-4">
          <div>
            <label className="block font-medium">Min</label>
            <input
              type="number"
              className="w-20 border rounded px-2 py-1"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block font-medium">Max</label>
            <input
              type="number"
              className="w-20 border rounded px-2 py-1"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
            />
          </div>
        </div>
      )}

      {/* Botón */}
      <div className="pt-4">
        <button
          type="button"
          className="w-full bg-[#147a64] text-white py-2 px-4 rounded hover:bg-[#0f5f4e]"
          onClick={handleSaveQuestion}
        >
          {existing ? "Salva modifiche" : "Aggiungi domanda"}
        </button>
      </div>
    </div>
  );
}
