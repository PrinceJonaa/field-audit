export interface RelationalAxisScore {
  self_other: number;          // Percent focus on others (0-100)
  agency_blame: number;        // Degree of externalizing responsibility (0-100)
  integrity_performance: number; // Truth vs performance (0-100)
}

export interface ChoiceFork {
  choice: string;
  outcome: string;
}

export interface FieldAuditAnalysis {
  field_signature: string;
  collapse_type: string;
  archetypes_triggered: string[];
  presence_level: string;
  RM_response: string;
  field_entropy_score?: number;
  collapse_trajectory_forecast?: string;
  mirror_load_meter?: number;
  field_inertia_type: string;
  relational_axis_score: RelationalAxisScore;
  suggested_rm_move: string;
  choice_forks?: ChoiceFork[];
}

export interface GeminiError {
  message: string;
  code?: number; // Optional: for HTTP status codes or specific error codes
}

// Types for Conversational RM Agent
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface TooltipData {
  term: string;
  definition: string;
  x: number;
  y: number;
  visible: boolean;
}

export interface TimelineEvent {
  id: string;
  choice: string; // The choice text
  outcome: string; // The outcome text of this choice
}