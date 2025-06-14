
import { PromptVersion } from './types';
import initialStoreData from './store.json' with { type: 'json' };

export class PromptManager {
  private prompts: PromptVersion[] = [];
  private lastEvolutionCollapsed: boolean = false;

  constructor() {
    // Load initial prompts from the imported JSON object
    // Ensure it's treated as an array of PromptVersion
    this.prompts = JSON.parse(JSON.stringify(initialStoreData)) as PromptVersion[];
    if (this.prompts.length > 0) {
        this.lastEvolutionCollapsed = this.prompts[this.prompts.length - 1].collapse;
    }
  }

  getCurrentPrompt(): string {
    if (this.prompts.length === 0) {
      // Fallback if store was empty or failed to load, though constructor loads initial
      return "You are a helpful assistant."; 
    }
    return this.prompts[this.prompts.length - 1].prompt;
  }

  addPrompt(prompt: string, deltaCause: string, collapse: boolean): void {
    const version: PromptVersion = {
      id: this.prompts.length.toString(), // Simple incrementing ID
      prompt,
      deltaCaused: deltaCause,
      collapse,
      timestamp: new Date().toISOString(),
    };
    this.prompts.push(version);
    this.lastEvolutionCollapsed = collapse;
    // In a browser environment, saving to localStorage could happen here if persistence is needed
    // localStorage.setItem('promptHistory', JSON.stringify(this.prompts));
  }

  getHistory(): PromptVersion[] {
    return [...this.prompts]; // Return a copy
  }

  clearHistory(): void {
    // Reset to a default initial prompt or load from initialStoreData again
    this.prompts = JSON.parse(JSON.stringify(initialStoreData)) as PromptVersion[];
    this.lastEvolutionCollapsed = this.prompts.length > 0 ? this.prompts[this.prompts.length-1].collapse : false;
    // if using localStorage: localStorage.removeItem('promptHistory');
  }

  didLastEvolutionCauseCollapse(): boolean {
      return this.lastEvolutionCollapsed;
  }
}