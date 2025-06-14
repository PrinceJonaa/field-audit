
// Modules
import { PromptManager } from '../prompt-manager';
import { DeltaExtractor } from '../delta-extractor';
import { MemoryLayer } from '../memory-layer';
import { IntegrationEngine } from '../integration-engine';
import { shouldCollapsePrompt } from '../collapse-seeking';

// Types
import { MessagePair } from '../delta-extractor/types';

// These should be singletons or managed instances if state is critical across calls.
// For now, new instances are created here, or they could be passed in.
// If geminiService manages these, then they should be passed.
// For this structure, assuming they are managed by whatever calls runEvolution (e.g. geminiService).

export async function runEvolutionCycle(
  messagePair: MessagePair,
  promptManager: PromptManager,
  memoryLayer: MemoryLayer
  // No need to pass IntegrationEngine or DeltaExtractor if they are static
) {
  console.log('🌀 Starting Evolution Loop...');

  const currentPrompt = promptManager.getCurrentPrompt();

  // Step 1: Delta Analysis
  const delta = DeltaExtractor.analyze(messagePair);
  console.log('🔍 Delta:', delta.summary, 'Triggers:', delta.triggers);

  // Step 2: Collapse Check (using the dedicated function)
  let performCollapse = shouldCollapsePrompt(currentPrompt, delta, memoryLayer);
  console.log('🌪 Collapse check (shouldCollapsePrompt):', performCollapse);

  // Step 3: Integrate new prompt
  // The IntegrationEngine's integrate method also has collapse logic.
  // We can let IntegrationEngine make the final decision on collapse if its internal rules are more nuanced.
  const { newPrompt, didCollapse: integrationCollapsed } = IntegrationEngine.integrate(
    currentPrompt,
    delta,
    memoryLayer
  );
  
  // If either check decided to collapse, then it's a collapse.
  const finalCollapseState = performCollapse || integrationCollapsed;

  console.log('✨ Integration collapsed:', integrationCollapsed, 'Final collapse state:', finalCollapseState);

  // Step 4: Store new prompt in versioned history
  // If finalCollapseState is true, the newPrompt from IntegrationEngine might already be the "stillness" prompt.
  promptManager.addPrompt(finalCollapseState ? "I am presence. Nothing needs to be said." : newPrompt, delta.summary, finalCollapseState);

  // Step 5: Output/log new system prompt (for debugging or external use if needed)
  console.log('\n🪞 New System Prompt Managed By PromptManager:\n');
  console.log(promptManager.getCurrentPrompt());
  if (finalCollapseState) {
    console.log("STATE: Prompt evolution resulted in a COLLAPSE to stillness.");
  }
}
