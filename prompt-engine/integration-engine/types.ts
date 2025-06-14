
import { Delta } from '../delta-extractor/types';
import { MemoryLayer } from '../memory-layer';

// Re-exporting for clarity, or could be directly imported by IntegrationEngine
export type { Delta, MemoryLayer };

export interface IntegrationResult {
  newPrompt: string;
  didCollapse: boolean;
}
