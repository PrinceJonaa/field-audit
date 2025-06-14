
import { Delta, MessagePair } from './types';
import { triggerPatterns } from './patterns';

export class DeltaExtractor {
  static analyze(pair: MessagePair): Delta {
    const combinedText = `${pair.user.toLowerCase()} ${pair.ai.toLowerCase()}`;
    const triggers: string[] = [];

    for (const [label, keywords] of Object.entries(triggerPatterns)) {
      if (keywords.some(kw => combinedText.includes(kw))) {
        triggers.push(label);
      }
    }

    const summary = triggers.length
      ? `Detected triggers: ${triggers.join(', ')}.`
      : `No major trigger detected. Field stable.`;

    return {
      summary,
      triggers,
    };
  }
}
