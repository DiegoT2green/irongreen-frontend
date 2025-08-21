import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { mockSurvey } from "./mockSurvey";
import QuestionCard from "./components/QuestionCard";
import StyledButton from "./components/StyledButton";
import ProgressHeader from "./components/ProgressHeader";
import QuestionRenderer from "./QuestionRenderer";
import { shouldShowQuestion } from "./logic";
import type { Question } from "./types";

export function SurveyApp() {
  const { token } = useParams();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [validToken, setValidToken] = useState(true); // simulazione token valido

  useEffect(() => {
    if (!token) {
      setValidToken(true); // permettiamo accesso per ora
    } else {
      setValidToken(true);
    }
  }, [token]);

  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    console.log("Risposte raccolte:", answers);
    // TODO: invio a backend /api/submit
  };

  if (!validToken)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">
        Token non valido.
      </p>
    );

const visibleQuestions = mockSurvey.questions.filter((q) =>
  shouldShowQuestion(q.id, answers, mockSurvey.logicRules)
);

  const totalVisible = visibleQuestions.length;
  const answeredCount = visibleQuestions.filter((q) => answers[q.id]).length;

  return (
<div className="max-w-xl mx-auto p-6 space-y-6">
      {/* Titolo e descrizione */}
      <h1 className="text-3xl font-bold text-center">{mockSurvey.title}</h1>
      <p className="text-gray-600 text-center">{mockSurvey.description}</p>

      {/* Domande */}
      {visibleQuestions.map((q: Question) => (
        <QuestionCard key={q.id} question={q}>
          <QuestionRenderer
            question={q}
            value={answers[q.id] || ""}
            onChange={(val) => handleChange(q.id, val.toString())}
          />
        </QuestionCard>
      ))}

      {/* Bottone di invio */}
      <div className="flex justify-center mt-6">
        <StyledButton onClick={handleSubmit}>Invia</StyledButton>
      </div>

{/* Footer progress bar */}
<div className="max-w-xl mx-auto">
  <ProgressHeader current={answeredCount} total={totalVisible} />
</div>
</div>
  );
}
