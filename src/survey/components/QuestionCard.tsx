// src/survey/components/QuestionCard.tsx
import type { ReactNode } from "react";
import type { Question } from "../types";

type Props = {
  question: Question;
  children: ReactNode;
};

export default function QuestionCard({ question, children }: Props) {
  return (
    <div className="bg-white shadow rounded p-4 space-y-2">
      <label className="block font-semibold text-gray-800">
        {question.label}
      </label>
      {children}
    </div>
  );
}
