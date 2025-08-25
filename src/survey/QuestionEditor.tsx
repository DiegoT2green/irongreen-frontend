import { useState, useEffect, useId, useMemo } from "react";
import type { Question, QuestionType } from "./types";

const questionTypes: QuestionType[] = [
  "text",
  "textarea",
  "radio",
  "checkbox",
  "scale",
  "slider",
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
  const [touched, setTouched] = useState(false);

  const fallbackId = useId();

  // Precargar datos si estamos editando
  useEffect(() => {
    if (existing) {
      setLabel(existing.label);
      setType(existing.type);
      setOptions(existing.options ?? []);
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
    setTouched(false);
  }, [existing]);

  // ---------- Helpers ----------
  const clean = (s: string) => s.trim();
  const uniquePush = (arr: string[], value: string) => {
    const v = clean(value);
    if (!v) return arr;
    if (arr.some((o) => o.toLocaleLowerCase() === v.toLocaleLowerCase()))
      return arr;
    return [...arr, v];
  };

  const moveOption = (idx: number, dir: -1 | 1) => {
    setOptions((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const removeOption = (idx: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddOption = () => {
    if (!optionInput) return;
    setOptions((prev) => uniquePush(prev, optionInput));
    setOptionInput("");
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddOption();
    }
    // Pegar múltiples opciones separadas por coma
    if (e.key === "," && optionInput.trim()) {
      e.preventDefault();
      handleAddOption();
    }
  };

  // ---------- Validación ----------
  const errors = useMemo(() => {
    const errs: string[] = [];
    if (!clean(label)) errs.push("La pregunta debe tener un texto.");

    if (type === "radio" || type === "checkbox") {
      if (options.length < 2) errs.push("Debes ingresar al menos 2 opciones.");
    }

    if (type === "slider" || type === "scale") {
      if (!Number.isFinite(min) || !Number.isFinite(max)) {
        errs.push("Min y Max deben ser números.");
      } else if (min >= max) {
        errs.push("Min debe ser menor que Max.");
      }
    }
    return errs;
  }, [label, type, options, min, max]);

  const isValid = errors.length === 0;

  // ---------- Guardar ----------
  const handleSaveQuestion = () => {
    setTouched(true);
    if (!isValid) return;

    const id = existing?.id ?? `q${Date.now()}-${fallbackId}`;

    const newQuestion: Question = {
      id,
      label: clean(label),
      type,
      ...(type === "radio" || type === "checkbox" ? { options } : {}),
      ...(type === "slider" || type === "scale" ? { min, max } : {}),
    };

    onAdd(newQuestion);
  };

  // ---------- UI ----------
  return (
    <div className="p-4 border rounded-lg bg-white shadow space-y-4">
      <h2 className="text-lg font-semibold">
        {existing ? "Modifica una domanda" : "Crea una nuova domanda"}
      </h2>

      {/* Testo della domanda */}
      <div className="space-y-2">
        <label className="block font-medium" htmlFor="qe-label">
          Testo della domanda
        </label>
        <input
          id="qe-label"
          type="text"
          className="w-full border rounded px-3 py-2"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Es. Ti senti soddisfatto del tuo ruolo?"
        />
      </div>

      {/* Tipo di risposta */}
      <div className="space-y-2">
        <label className="block font-medium" htmlFor="qe-type">
          Tipo di risposta
        </label>
        <select
          id="qe-type"
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
          <label className="block font-medium" htmlFor="qe-option">
            Opzioni
          </label>
          <div className="flex gap-2">
            <input
              id="qe-option"
              type="text"
              className="flex-grow border rounded px-2 py-1"
              value={optionInput}
              onChange={(e) => setOptionInput(e.target.value)}
              onKeyDown={handleOptionKeyDown}
              placeholder="Scrivi un'opzione e premi Enter"
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
            <ul className="text-sm text-gray-700 space-y-1">
              {options.map((opt, idx) => (
                <li
                  key={`${opt}-${idx}`}
                  className="flex items-center justify-between border rounded px-2 py-1 bg-gray-50"
                >
                  <span className="truncate">{opt}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-2 py-0.5 border rounded text-xs"
                      onClick={() => moveOption(idx, -1)}
                      disabled={idx === 0}
                      title="Sposta su"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="px-2 py-0.5 border rounded text-xs"
                      onClick={() => moveOption(idx, +1)}
                      disabled={idx === options.length - 1}
                      title="Sposta giù"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="px-2 py-0.5 border rounded text-xs text-red-600"
                      onClick={() => removeOption(idx)}
                      title="Rimuovi"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Slider / Scale */}
      {(type === "slider" || type === "scale") && (
        <div className="flex gap-4">
          <div>
            <label className="block font-medium" htmlFor="qe-min">
              Min
            </label>
            <input
              id="qe-min"
              type="number"
              className="w-24 border rounded px-2 py-1"
              value={Number.isFinite(min) ? min : ""}
              onChange={(e) => setMin(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block font-medium" htmlFor="qe-max">
              Max
            </label>
            <input
              id="qe-max"
              type="number"
              className="w-24 border rounded px-2 py-1"
              value={Number.isFinite(max) ? max : ""}
              onChange={(e) => setMax(Number(e.target.value))}
            />
          </div>
        </div>
      )}

      {/* Errores de validación */}
      {touched && !isValid && (
        <ul className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm space-y-1">
          {errors.map((e, i) => (
            <li key={i}>• {e}</li>
          ))}
        </ul>
      )}

      {/* Botón */}
      <div className="pt-2">
        <button
          type="button"
          className={`w-full py-2 px-4 rounded text-white ${
            isValid
              ? "bg-[#147a64] hover:bg-[#0f5f4e]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleSaveQuestion}
          disabled={!isValid}
        >
          {existing ? "Salva modifiche" : "Aggiungi domanda"}
        </button>
      </div>
    </div>
  );
}
