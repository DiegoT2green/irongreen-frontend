import { useState } from "react";
import type { Question, LogicRule } from "./types";
import QuestionEditor from "./QuestionEditor";
import QuestionRenderer from "./QuestionRenderer";
import LogicEditor from "./LogicEditor";

export default function EditorPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [logicRules, setLogicRules] = useState<LogicRule[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (q: Question) => {
    setQuestions((prev) => [...prev, q]);
  };

  const handleDelete = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setLogicRules((prev) =>
      prev.filter((r) => r.showQuestionId !== id) // elimina reglas ligadas a esa pregunta
    );
    if (editingId === id) setEditingId(null);
  };

  const handleStartEdit = (id: string) => {
    setEditingId(id);
  };

  const handleUpdate = (updated: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q))
    );
    setEditingId(null);
  };

  const handleAddRule = (rule: LogicRule) => {
    setLogicRules((prev) => [...prev, rule]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-10 px-4">
      <h1 className="text-2xl font-bold text-center">Editor Domande</h1>

      {/* Editor nuovo o modifica */}
      <div className="border rounded-lg p-4 bg-white shadow">
        <h2 className="text-lg font-semibold mb-2">
          {editingId ? "Modifica domanda" : "Nuova domanda"}
        </h2>
        <QuestionEditor
          onAdd={editingId ? handleUpdate : handleAdd}
          existing={
            editingId
              ? questions.find((q) => q.id === editingId) ?? undefined
              : undefined
          }
        />
      </div>

      {/* Logic Editor */}
      {questions.length > 0 && (
        <div className="border rounded-lg p-4 bg-white shadow">
          <LogicEditor questions={questions} onAddRule={handleAddRule} />
        </div>
      )}

      {/* Lista delle domande */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="border p-4 rounded bg-gray-50 shadow-sm space-y-2"
          >
            <div className="font-semibold">{q.label}</div>
            <QuestionRenderer question={q} value="" onChange={() => {}} />

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleStartEdit(q.id)}
                className="text-blue-600 text-sm hover:underline"
              >
                Modifica
              </button>
              <button
                onClick={() => handleDelete(q.id)}
                className="text-red-600 text-sm hover:underline"
              >
                Elimina
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* JSON output */}
      <div className="bg-gray-100 p-4 rounded text-sm mt-6">
        <h2 className="font-semibold mb-2">Anteprima JSON completa:</h2>
        <pre>
          {JSON.stringify(
            {
              title: "Business Happiness Survey",
              description: "Questionario generato dinamicamente",
              questions,
              logicRules
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
