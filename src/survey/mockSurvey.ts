import { Survey } from "./types";

export const mockSurvey: Survey = {
  title: "Business Happiness",
  description: "Aiutaci a migliorare la tua esperienza lavorativa.",
  questions: [
    {
      id: "q1",
      type: "radio",
      label: "Ti senti soddisfatto/a al lavoro?",
      options: ["Sì", "No"]
    },
    {
      id: "q1a",
      type: "textarea",
      label: "Perché ti senti soddisfatto/a?"
    },
    {
      id: "q1b",
      type: "textarea",
      label: "Cosa ti rende insoddisfatto/a?"
    },
    {
      id: "q2",
      type: "slider",
      label: "Quanto ti senti ascoltato/a (1-10)?",
      min: 1,
      max: 10
    },
    {
      id: "q3",
      type: "radio",
      label: "Hai un buon equilibrio tra vita privata e lavoro?",
      options: ["Sì", "No"]
    },
    {
      id: "q4",
      type: "textarea",
      label: "Hai suggerimenti per migliorare?"
    },
    {
      id: "q5",
      type: "radio",
      label: "Quanto è chiaro il tuo ruolo all'interno dell'azienda?",
      options: ["Molto", "Abbastanza", "Poco", "Per niente"]
    },
    {
      id: "q6",
      type: "checkbox",
      label: "Quali elementi influenzano maggiormente il tuo benessere?",
      options: [
        "Carico di lavoro",
        "Ambiente di lavoro",
        "Relazioni con colleghi",
        "Leadership",
        "Flessibilità"
      ]
    },
    {
      id: "q7",
      type: "textarea",
      label: "Cosa ti rende orgoglioso/a del tuo lavoro?"
    }
  ],
  logicRules: [
    {
      id: "rule1",
      operator: "AND",
      conditions: [
        {
          questionId: "q1",
          operator: "equals",
          value: "Sì"
        }
      ],
      showQuestionId: "q1a"
    },
    {
      id: "rule2",
      operator: "AND",
      conditions: [
        {
          questionId: "q1",
          operator: "equals",
          value: "No"
        }
      ],
      showQuestionId: "q1b"
    }
  ]
};
