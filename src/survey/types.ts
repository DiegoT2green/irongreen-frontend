// Tipos posibles de pregunta
export type QuestionType =
  | "text"
  | "textarea"
  | "radio"
  | "checkbox"
  | "scale"
  | "slider";

// Condición individual (ej. "si respuesta a P1 es 'Sí'")
export type Condition = {
  questionId: string;
  operator: "equals" | "not_equals" | "contains" | "less_than" | "greater_than";
  value: string;
};


// Reglas de lógica condicional (puede haber varias por encuesta)
export type LogicRule = {
  id: string; // ID único para gestión interna
  conditions: Condition[];
  operator: "AND" | "OR"; // cómo combinar condiciones
  showQuestionId: string; // qué pregunta mostrar si se cumple
};

// Pregunta individual
export type Question = {
  id: string;
  label: string;
  type: QuestionType;
  options?: string[]; // para radio o checkbox
  min?: number;       // para scale o slider
  max?: number;
};

// Encuesta completa
export interface Survey {
  title: string;
  description: string;
  questions: Question[];
  logicRules?: LogicRule[]; // ahora las reglas van aquí
}
