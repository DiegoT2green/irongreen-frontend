import type { Question } from "./types";

type Props = {
  question: Question;
  value: string | number;
  onChange: (val: string | number) => void;
};

export default function QuestionRenderer({ question, value, onChange }: Props) {
  if (question.type === "radio" && question.options) {
    return (
      <div className="space-y-2">
        {question.options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={question.id}
              value={opt}
              checked={value === opt}
              onChange={(e) => onChange(e.target.value)}
              className="accent-[#147a64]"
            />
            {opt}
          </label>
        ))}
      </div>
    );
  }

  if (question.type === "checkbox" && question.options) {
    const currentValues = typeof value === "string" ? value.split(",") : [];
    return (
      <div className="space-y-2">
        {question.options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentValues.includes(opt)}
              onChange={(e) => {
                const updated = e.target.checked
                  ? [...currentValues, opt]
                  : currentValues.filter((v) => v !== opt);
                onChange(updated.join(","));
              }}
              className="accent-[#147a64]"
            />
            {opt}
          </label>
        ))}
      </div>
    );
  }
if (question.type === "text") {
  return (
    <input
      type="text"
      className="w-full border border-gray-300 rounded px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#147a64]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

  if (question.type === "textarea") {
    return (
      <textarea
        className="w-full border border-gray-300 rounded px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#147a64]"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (question.type === "slider") {
    const min = question.min ?? 0;
    const max = question.max ?? 10;
    return (
      <div className="flex items-center gap-4">
        <input
          type="range"
          className="w-full accent-[#147a64] cursor-pointer"
          min={min}
          max={max}
          value={Number(value) || min}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="font-mono text-sm w-8 text-right">{value || min}</span>
      </div>
    );
  }

  return null;
}
