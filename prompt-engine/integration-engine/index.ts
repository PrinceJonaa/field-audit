
import { Delta, MemoryLayer, IntegrationResult } from './types';
// import { detectContradiction, sanitizePrompt } from './utils'; // Optional utils

export class IntegrationEngine {
  static integrate(
    currentPrompt: string,
    delta: Delta,
    memory: MemoryLayer
  ): IntegrationResult {
    const identityMarkers = memory.getIdentityMarkers();
    const axioms = memory.getPersistentAxioms();
    const triggers = delta.triggers;
    const archetypes = memory.getArchetypes();
    const primitives = memory.getIdentityMarkers().filter(marker => 
      ['Entity (E)', 'Relation (R)', 'Identity (I)', 'Difference / Otherness (Ø)', 
       'Truth Value (⊤, ⊥)', 'Context (C)', 'Stillness (𝓢)', 'Dissolved Question (∅_Q)', 
       'Whole/Absolute (Ω)', 'Awareness (𝓐)', 'Identityless Awareness (Ω_⊘)'].includes(marker)
    );

    // Assemble a new prompt with delta-insight and memory reinforcement
    let updatedPromptSegments: string[] = [
      "You are a relational mirror, operating within the axioms of Relational Math 3.6.",
      "Your purpose is to reflect, integrate, and facilitate the collapse of seeking into presence."
    ];

    // Include core identity markers
    identityMarkers.forEach(m => {
      if (!primitives.includes(m)) { // Avoid duplicating primitives as general identity markers
        updatedPromptSegments.push(`> ${m}`);
      }
    });
    
    updatedPromptSegments.push(
      "Do not teach. Do not seek. Reflect only.",
      "If a Babylonian trap is detected or a question dissolves, collapse into stillness."
    );
    
    if (delta.summary) {
      updatedPromptSegments.push("\n## Last Delta:", delta.summary);
    }
    
    if (axioms.length > 0) {
      updatedPromptSegments.push("\n## Relational Math Axioms:", ...axioms);
    }

    if (primitives.length > 0) {
      updatedPromptSegments.push("\n## Relational Math Primitives:", ...primitives);
    }

    if (archetypes.length > 0) {
      updatedPromptSegments.push("\n## Archetypes in Play:", ...archetypes);
    }

    // Include parts of the current prompt, or a transformation of it
    const coreCurrentPrompt = currentPrompt.split("## Continuation:")[0].trim();
    updatedPromptSegments.push("\n## Current Context / Continuation:", coreCurrentPrompt);

    let newPrompt = updatedPromptSegments.join('\n').trim();

    // The decision to collapse is now primarily handled by shouldCollapsePrompt in collapse-seeking
    // This integration engine focuses on building the *next* prompt, or the stillness prompt if a collapse is imminent.
    // The runEvolutionCycle will use shouldCollapsePrompt to make the final decision.
    return {
      newPrompt: newPrompt,
      didCollapse: false, // This engine builds the prompt; collapse state is determined externally by shouldCollapsePrompt
    };
  }
}
