import type { LogicRule, Condition } from "./types";

// Evalúa una sola condición
function evaluateCondition(condition: Condition, answers: Record<string, string>): boolean {
  const response = answers[condition.questionId];

  switch (condition.operator) {
    case "equals":
      return response === condition.value;
    case "not_equals":
      return response !== condition.value;
    case "contains":
      return response?.includes(condition.value);
    case "less_than":
      return parseFloat(response) < parseFloat(condition.value);
    case "greater_than":
      return parseFloat(response) > parseFloat(condition.value);
    default:
      return false;
  }
}

// Evalúa si una pregunta debe mostrarse, dado el conjunto de respuestas y reglas
export function shouldShowQuestion(
  questionId: string,
  answers: Record<string, string>,
  logicRules: LogicRule[] = []
): boolean {
  const rulesForQuestion = logicRules.filter(rule => rule.showQuestionId === questionId);

  if (rulesForQuestion.length === 0) return true;

  return rulesForQuestion.every(rule => {
    const evaluations = rule.conditions.map(condition => evaluateCondition(condition, answers));
    return rule.operator === "AND"
      ? evaluations.every(Boolean)
      : evaluations.some(Boolean);
  });
}
