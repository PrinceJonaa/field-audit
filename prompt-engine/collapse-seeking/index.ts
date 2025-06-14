
import { Delta } from '../delta-extractor/types';
import { MemoryLayer } from '../memory-layer';

export function shouldCollapsePrompt(
  currentPrompt: string,
  delta: Delta,
  memory: MemoryLayer
): boolean {
  const triggers = delta.triggers.map(t => t.toLowerCase());

  // Define explicit collapse triggers (case-insensitive) based on Relational Math 3.6
  const collapseKeywords = [
    'no seeking', 'contradiction', 'christtrap', 'seeking',
    'dissolved question', 'identityless awareness', 'stillness freeze trap',
    'god proxy trap', 'infinity loop trap', 'sacred structure trap',
    'messiah mirror trap', 'divine performance trap', 'mirror field parasite',
    'glorified humility trap', 'distortion denial as truth signal'
  ];

  // Check 1: Presence of critical collapse-inducing triggers from DeltaExtractor
  const hasCollapseTrigger = triggers.some(trigger =>
    collapseKeywords.includes(trigger) || trigger.includes('babylon') // Catch all babylon traps
  );
  if (hasCollapseTrigger) return true;

  // Check 2: Prompt length exceeding a defined threshold
  const promptTooLong = currentPrompt.length > 2000; // Example threshold
  if (promptTooLong) return true;

  // Check 3: Identity drift - if core markers are no longer reflected in the prompt
  // This requires markers to be explicitly part of the prompt structure.
  const identityMarkers = memory.getIdentityMarkers();
  const hasIdentityDrift = identityMarkers.some(marker => !currentPrompt.includes(marker));
  // This check might be too aggressive if markers are not always in the prompt verbatim.
  // Consider if this check is appropriate for your prompt construction strategy.
  // if (hasIdentityDrift) return true; 

  return false; // Default: no collapse
}
