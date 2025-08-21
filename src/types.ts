export interface Rapport {
  codice: string;
  descrizione: string;
  tecnico: string;
  effort: string;
  data: string;
}

export interface Sottocommessa {
  codice: number;
  descrizione: string;
  durataGiorni: number;
  scheduledEffort: number;
  scheduledStart: string | null;
  scheduledFinish: string | null;
  actualEffort: string | number;
  deltaEffort: string | number;
  actualStart: string | null;
  lastUpdate: string | null;
  actualEnd: string | null;
  deltaGiorniScheduled: string | number;
  taskOwner: string;
  rapport: Rapport[];

  // CAMPI CALCOLATI (opzionali)
  effortActual?: number;
  effortDelta?: number;
  pctComplete?: number;
  deltaGiorni?: number;
  giorniTotali?: number;
  stato?: string;
  
}

export interface Commessa {
  codice: string;
  descrizione: string;
  responsabile: string;
  scheduledEffort: number;
  scheduledStart: string | null;
  scheduledFinish: string | null;
  sottocommesse: Sottocommessa[];

  // CAMPI CALCOLATI (opzionali)
  nome?: string;
  dataInizio?: string | null;
  dataFine?: string | null;
  stato?: string;
  giorniTotali?: number;
  effortScheduled?: number;
  effortActual?: number;
  effortDelta?: number;
  pctCompleteMedia?: number;
  figli?: Sottocommessa[];
}
