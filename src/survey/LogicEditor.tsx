import { useState } from "react";
import type { LogicRule, Condition, Question } from "./types";

type Props = {
  questions: Question[];
  onAddRule: (rule: LogicRule) => void;
};

export default function LogicEditor({ questions, onAddRule }: Props) {
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [operator, setOperator] = useState<"AND" | "OR">("AND");
  const [conditions, setConditions] = useState<Condition[]>([]);

  const addCondition = () => {
    setConditions((prev) => [
      ...prev,
      { questionId: "", operator: "equals", value: "" }
    ]);
  };

  const updateCondition = (index: number, updated: Partial<Condition>) => {
    setConditions((prev) =>
      prev.map((cond, i) => (i === index ? { ...cond, ...updated } : cond))
    );
  };

  const removeCondition = (index: number) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddRule = () => {
    if (!selectedTargetId || conditions.length === 0) return;

    const rule: LogicRule = {
      id: `rule-${Date.now()}`,
      operator,
      conditions,
      showQuestionId: selectedTargetId
    };

    onAddRule(rule);

    // Reset
    setSelectedTargetId("");
    setOperator("AND");
    setConditions([]);
  };

  const questionOptions = questions.map((q) => (
    <option key={q.id} value={q.id}>
      {q.label}
    </option>
  ));

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow">
      <h2 className="text-lg font-semibold">Aggiungi regola di visibilità</h2>

      {/* Domanda da mostrare */}
      <div>
        <label className="block font-medium mb-1">
          Mostra la domanda:
        </label>
        <select
          className="w-full border rounded px-3 py-2"
          value={selectedTargetId}
          onChange={(e) => setSelectedTargetId(e.target.value)}
        >
          <option value="">-- Seleziona una domanda --</option>
          {questionOptions}
        </select>
      </div>

      {/* Operatore */}
      <div>
        <label className="block font-medium mb-1">Tipo di logica</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={operator}
          onChange={(e) => setOperator(e.target.value as "AND" | "OR")}
        >
          <option value="AND">Tutte le condizioni devono essere vere (AND)</option>
          <option value="OR">Almeno una condizione deve essere vera (OR)</option>
        </select>
      </div>

      {/* Condizioni */}
      <div className="space-y-4">
        <label className="block font-medium">Condizioni</label>
        {conditions.map((cond, idx) => (
          <div
            key={idx}
            className="flex gap-2 items-center border p-2 rounded bg-gray-50"
          >
            <select
              className="border rounded px-2 py-1"
              value={cond.questionId}
              onChange={(e) =>
                updateCondition(idx, { questionId: e.target.value })
              }
            >
              <option value="">Domanda</option>
              {questionOptions}
            </select>
            <select
              className="border rounded px-2 py-1"
              value={cond.operator}
              onChange={(e) =>
                updateCondition(idx, {
                  operator: e.target.value as Condition["operator"]
                })
              }
            >
              <option value="equals">=</option>
              <option value="not_equals">≠</option>
              <option value="contains">contiene</option>
              <option value="less_than">&lt;</option>
              <option value="greater_than">&gt;</option>
            </select>
            <input
              type="text"
              className="border rounded px-2 py-1 flex-grow"
              placeholder="Valore"
              value={cond.value}
              onChange={(e) => updateCondition(idx, { value: e.target.value })}
            />
            <button
              onClick={() => removeCondition(idx)}
              className="text-red-600 text-sm hover:underline"
            >
              Rimuovi
            </button>
          </div>
        ))}
        <button
          onClick={addCondition}
          className="bg-[#147a64] text-white px-4 py-1 rounded text-sm"
        >
          + Aggiungi condizione
        </button>
      </div>

      <div className="pt-4">
        <button
          onClick={handleAddRule}
          className="w-full bg-[#147a64] text-white py-2 px-4 rounded hover:bg-[#0f5f4e]"
        >
          Salva regola
        </button>
      </div>
    </div>
  );
}
