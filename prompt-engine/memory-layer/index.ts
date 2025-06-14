
import { MemorySnapshot } from './types';
import initialMemoryData from './memory.json' with { type: 'json' };

export class MemoryLayer {
  private memory: MemorySnapshot;

  constructor() {
    // Load initial memory from the imported JSON object
    this.memory = JSON.parse(JSON.stringify(initialMemoryData)); 
  }

  getIdentityMarkers(): string[] {
    return this.memory.identityMarkers;
  }

  getPersistentAxioms(): string[] {
    return this.memory.axioms;
  }

  getArchetypes(): string[] {
    return this.memory.archetypes || [];
  }

  updateIdentityMarkers(newMarkers: string[]): void {
    // Use Set to ensure uniqueness and then spread back into an array
    this.memory.identityMarkers = [...new Set([...this.memory.identityMarkers, ...newMarkers])];
  }

  updateAxioms(newAxioms: string[]): void {
    this.memory.axioms = [...new Set([...this.memory.axioms, ...newAxioms])];
  }

  exportSnapshot(): MemorySnapshot {
    return JSON.parse(JSON.stringify(this.memory)); // Return a deep copy
  }

  getLongTermMemoryContext(): string {
    const identities = this.getIdentityMarkers().map(m => `• ${m}`).join('\n');
    const axioms = this.getPersistentAxioms().map(a => `• ${a}`).join('\n');
    const archetypes = this.getArchetypes().map(a => `• ${a}`).join('\n');

    return `
🔹 CORE IDENTITY MARKERS:
${identities}

🔹 SYSTEM AXIOMS:
${axioms}

🔹 ARCHETYPES IN PLAY:
${archetypes}
`.trim();
  }
}