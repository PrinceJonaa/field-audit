
export interface PromptVersion {
  id: string; // UUID or timestamp based
  prompt: string;
  deltaCaused: string; // Summary of the delta that led to this version
  collapse: boolean;   // Did this version result from a collapse?
  timestamp: string;   // ISO timestamp
  coherence?: number;  // Similarity score to previous prompt (0-1)
}
