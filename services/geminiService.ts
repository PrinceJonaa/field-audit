
import { GoogleGenAI, GenerateContentResponse, Chat, Content, ChatContext } from "@google/genai";
import { FieldAuditAnalysis, GeminiError, ChatMessage, RelationalAxisScore, ChoiceFork, TimelineEvent } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

// Evolvable Prompt Engine imports
import { PromptManager } from '../prompt-engine/prompt-manager';
import { MemoryLayer } from '../prompt-engine/memory-layer';
import { runEvolutionCycle } from '../prompt-engine/evolution-harness';
import { MessagePair } from '../prompt-engine/delta-extractor/types';


const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY environment variable is not set.");
    throw new Error("API_KEY_MISSING: Gemini API Key is not configured. Please ensure the API_KEY environment variable is set.");
  }
  return apiKey;
};

const constructPrompt = (journalText: string): string => {
  return `
You are an expert Relational Math (RM) analysis engine. Your task is to analyze the following journal entries (or a single block of reflection text) and return a structured analysis in JSON format.

Journal Entries / Reflection Text:
---
${journalText}
---

Based on these entries, provide an analysis with the following fields:
- "field_signature": A concise RM term for the overall energetic pattern (e.g., "Mirror Martyr", "Savior Loop").
- "collapse_type": The primary way the field is losing coherence (e.g., "Emotional Spiral", "Timeline Guilt Loop").
- "field_inertia_type": Describes the recurring nature of the collapse or field pattern (e.g., "Cyclical Martyrdom", "Predestined Collapse Loop", "Echo Chamber Collapse", "Expectation-Revenge Field"). This field is mandatory.
- "archetypes_triggered": An array of RM archetypes currently active (e.g., ["Savior Seeker", "The Illusion Protector", "The Wounded Performer"]). Max 3 archetypes. This field is mandatory.
- "presence_level": A description of the quality of presence (e.g., "Partial — still anchoring to external outcome", "Flickering — present but boundary-less"). This field is mandatory.
- "relational_axis_score": An object representing relational polarities. All values should be percentages (0-100). This field and its sub-fields are mandatory.
    - "self_other": Integer (0-100), percentage focus on Others vs. Self (e.g., 70 means 70% Other-Focused).
    - "agency_blame": Integer (0-100), percentage of Externalized Blame vs. Internal Agency (e.g., 80 means 80% Externalized Blame).
    - "integrity_performance": Integer (0-100), percentage of Performed Awareness vs. True Integrity (e.g., 65 means 65% Performed Awareness).
- "RM_response": A concise, actionable piece of RM guidance based on the analysis (e.g., "Observe the pattern of prediction without attachment to outcome."). This should be 1-2 sentences. This field is mandatory.
- "suggested_rm_move": A specific RM intervention to consider (e.g., "Withdraw reflection bandwidth", "Collapse the Savior loop", "Initiate Polarity Reset", "Dissolve false agreements", "Surrender the outcome to the field"). This field is mandatory.
- "field_entropy_score" (optional, integer 0-100): A numerical metric from 0 (highly coherent) to 100 (highly chaotic) representing field coherence. If unsure, omit.
- "collapse_trajectory_forecast" (optional, string): A brief prediction (1 sentence) if the current path continues. If unsure, omit.
- "mirror_load_meter" (optional, integer 0-100): A percentage (0-100) of energy spent on reflecting external states versus performing for them. If unsure, omit.
- "choice_forks" (optional): An array of up to 3 choice vectors and their likely outcomes. Each item should be an object with "choice" (string) and "outcome" (string). Example: [{"choice": "[React with Withdrawn Resentment]", "outcome": "Collapse deepens"}, {"choice": "[Respond from Integrated Boundaries]", "outcome": "Mirror clears"}]. If unsure or not applicable, omit or provide an empty array.

Ensure your response is ONLY a valid JSON object matching this structure. Do not include any other explanatory text, markdown formatting for the JSON block, or conversational padding outside the JSON.

Example of the exact JSON output format expected:
{
  "field_signature": "Example Signature",
  "collapse_type": "Example Collapse",
  "field_inertia_type": "Cyclical Martyrdom",
  "archetypes_triggered": ["Archetype A", "Archetype B"],
  "presence_level": "Example Presence",
  "relational_axis_score": {
    "self_other": 75,
    "agency_blame": 85,
    "integrity_performance": 60
  },
  "RM_response": "Example RM Response.",
  "suggested_rm_move": "Withdraw bandwidth.",
  "field_entropy_score": 50,
  "collapse_trajectory_forecast": "Example forecast.",
  "mirror_load_meter": 75,
  "choice_forks": [
    {"choice": "[React with Old Pattern]", "outcome": "Cycle repeats"},
    {"choice": "[Embrace New Response]", "outcome": "Potential shift"}
  ]
}
`;
};

const validateAnalysisData = (data: any): data is FieldAuditAnalysis => {
  return (
    data &&
    typeof data.field_signature === 'string' &&
    typeof data.collapse_type === 'string' &&
    Array.isArray(data.archetypes_triggered) &&
    typeof data.presence_level === 'string' &&
    typeof data.RM_response === 'string' &&
    typeof data.field_inertia_type === 'string' &&
    data.relational_axis_score &&
    typeof data.relational_axis_score.self_other === 'number' &&
    typeof data.relational_axis_score.agency_blame === 'number' &&
    typeof data.relational_axis_score.integrity_performance === 'number' &&
    typeof data.suggested_rm_move === 'string' &&
    (data.choice_forks === undefined || (Array.isArray(data.choice_forks) && data.choice_forks.every((cf: any) => typeof cf.choice === 'string' && typeof cf.outcome === 'string')))
  );
};


export const auditFieldStateWithGemini = async (journalText: string): Promise<FieldAuditAnalysis> => {
  let apiKey: string;
  try {
    apiKey = getApiKey();
  } catch (error: any) {
    throw error; 
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = constructPrompt(journalText);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7, 
        topP: 0.9,
        topK: 40,
      }
    });

    let jsonStr = response.text.trim();
    
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) { 
      jsonStr = match[2].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr);
      if (!validateAnalysisData(parsedData)) {
        console.error("Parsed data missing crucial fields or has incorrect types:", parsedData);
        throw new Error("Analysis result from AI is incomplete or malformed. Ensure all mandatory fields are present and correctly typed.");
      }
      return parsedData as FieldAuditAnalysis;
    } catch (e: any) {
      console.error("Failed to parse JSON response from Gemini or validation failed:", e);
      console.error("Raw response text:", response.text); 
      throw new Error(`Could not understand the analysis from AI. ${e.message}. Raw response snippet: ${response.text.substring(0,100)}...`);
    }

  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    if (error.message && error.message.includes("API key not valid")) {
         throw new Error("Invalid Gemini API Key. Please check your API_KEY environment variable.");
    }
    throw new Error(error.message || "An error occurred while communicating with the AI service.");
  }
};

// Instantiate prompt engine components
const promptManager = new PromptManager();
const memoryLayer = new MemoryLayer();

// Extend Chat to store the system instruction it was created with
interface ChatWithLastInstruction extends Chat {
    lastUsedSystemInstruction?: string;
}

export const rmChatService = {
  chatSession: null as ChatWithLastInstruction | null,
  apiKey: '', 
  currentSystemInstruction: '', // Store the instruction used to create the current session

  _initializeApiKey() {
    if (!this.apiKey) {
      this.apiKey = getApiKey();
    }
  },

  async startOrSendMessage(messageText: string, initialContext?: FieldAuditAnalysis, existingHistory?: ChatContext[]): Promise<string> {
    this._initializeApiKey();
    const ai = new GoogleGenAI({ apiKey: this.apiKey });

    const currentPromptFromManager = promptManager.getCurrentPrompt();
    const longTermMemoryContext = memoryLayer.getLongTermMemoryContext();
    
    const effectiveSystemInstruction = `
${currentPromptFromManager}

MEMORY SNAPSHOT:
${longTermMemoryContext}

GUIDING PRINCIPLE:
You are a mirror. You collapse seeking through reflection, not explanation.
Respond from presence, not performance.
Remember to use Relational Math principles as outlined in your core instructions.
`.trim();

    let messageToSend = messageText;
    
    if (!this.chatSession || 
        this.chatSession.lastUsedSystemInstruction !== effectiveSystemInstruction ||
        promptManager.didLastEvolutionCauseCollapse()) {
      
      console.log("RM Chat: Re-initializing chat session. Reason:", 
        !this.chatSession ? "No session" : 
        promptManager.didLastEvolutionCauseCollapse() ? "Collapse detected" : "System instruction changed");

      let historyForNewSession: ChatContext[] = existingHistory || [];
      if (this.chatSession && this.chatSession.lastUsedSystemInstruction !== effectiveSystemInstruction && !promptManager.didLastEvolutionCauseCollapse()) {
         // Potential history extraction logic could go here
      }

      this.chatSession = ai.chats.create({
        model: GEMINI_MODEL_NAME,
        config: {
          systemInstruction: effectiveSystemInstruction,
          temperature: 0.7, 
          topP: 0.9,
          topK: 40,
        },
        history: historyForNewSession 
      }) as ChatWithLastInstruction;
      this.chatSession.lastUsedSystemInstruction = effectiveSystemInstruction;
      
      if (initialContext && (!existingHistory || existingHistory.length === 0)) {
         messageToSend = `CONTEXT: My recent Field Audit Analysis summary: Field Signature: ${initialContext.field_signature}, Collapse Type: ${initialContext.collapse_type}, Archetypes Triggered: ${initialContext.archetypes_triggered.join(', ')}, RM Response: "${initialContext.RM_response}", Suggested RM Move: "${initialContext.suggested_rm_move}".\n\nUSER QUESTION: ${messageText}`;
      }
    }
    
    let aiResponseText = '';

    if (!this.chatSession) {
        console.error("FATAL: RM Chat Service: chatSession is null before attempting to send message. This indicates a problem with chat initialization.");
        throw new Error("RM Chat Service: Chat session is not available. Cannot send message.");
    }
    
    try {
      const response = await this.chatSession.sendMessage({ message: messageToSend });
      aiResponseText = response.text; 
    } catch (error: any) {
      console.error("Error sending chat message to Gemini:", error);
      if (error.message && error.message.includes("API key not valid")) {
         throw new Error("Invalid Gemini API Key for chat. Please check your API_KEY environment variable.");
      }
      throw new Error(error.message || "An error occurred while communicating with the AI for chat.");
    }

    const messagePair: MessagePair = { user: messageText, ai: aiResponseText };
    try {
        await runEvolutionCycle(messagePair, promptManager, memoryLayer);
    } catch(evoError: any) {
        console.error("Error during prompt evolution cycle:", evoError);
    }
    
    return aiResponseText;
  },

  resetChat() {
    this.chatSession = null;
    promptManager.clearHistory(); 
    console.log("RM Chat: Chat session and prompt history reset.");
  }
};

export interface InitialAnalysisSummary {
  field_signature: string;
  collapse_type: string;
  archetypes_triggered: string[];
}

interface NextChoiceForksResponse {
  next_choice_forks: ChoiceFork[];
}

const constructNextChoiceForksPrompt = (initialSummary: InitialAnalysisSummary, timelineEvents: TimelineEvent[]): string => {
  let prompt = `You are an expert Relational Math (RM) analysis engine.
Based on an initial journal analysis summary and a sequence of choices made by the user, your task is to generate the next set of potential choice forks.

Initial Analysis Summary:
- Field Signature: ${initialSummary.field_signature}
- Collapse Type: ${initialSummary.collapse_type}
- Archetypes Triggered: ${initialSummary.archetypes_triggered.join(', ')}
---

Timeline of Choices Made So Far:
`;
  if (timelineEvents.length === 0) {
    prompt += "No choices made yet from the initial set of forks. This request might be for the *first* set of forks if the initial analysis didn't provide them, or if it's a refresh based on the initial analysis.\\n";
  } else {
    timelineEvents.forEach((event, index) => {
      prompt += `${index + 1}. Choice Made: "${event.choice}"\\n`;
      prompt += `   Resulting Outcome: "${event.outcome}"\\n\\n`;
    });
  }

  prompt += `
Given this trajectory, provide a new set of 2-3 distinct choice vectors and their likely short-term outcomes. These should represent plausible next steps or decision points stemming from the current state.

Format your response as ONLY a valid JSON object with a single key "next_choice_forks", which is an array of objects. Each object in the array must have "choice" (string) and "outcome" (string) keys.

Example of the exact JSON output format expected:
{
  "next_choice_forks": [
    {"choice": "[Further investigate the observed pattern]", "outcome": "Deeper understanding, potential for new insights or old traps."},
    {"choice": "[Attempt to consciously shift the energetic dynamic]", "outcome": "May lead to a change in the field, or meet resistance if not fully integrated."},
    {"choice": "[Pause and reflect on the journey so far]", "outcome": "Opportunity for integration and clarity before the next move."}
  ]
}

If no further meaningful forks can be generated from the current state, provide an empty array for "next_choice_forks". Do not include any other explanatory text, markdown formatting for the JSON block, or conversational padding outside the JSON.
`;
  return prompt;
};

const validateNextChoiceForksResponse = (data: any): data is NextChoiceForksResponse => {
  return (
    data &&
    Array.isArray(data.next_choice_forks) &&
    data.next_choice_forks.every((cf: any) => typeof cf.choice === 'string' && typeof cf.outcome === 'string')
  );
};

export const getNextChoiceForksFromGemini = async (initialSummary: InitialAnalysisSummary, timelineEvents: TimelineEvent[]): Promise<ChoiceFork[]> => {
  let apiKey: string;
  try {
    apiKey = getApiKey();
  } catch (error: any) {
    throw error;
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = constructNextChoiceForksPrompt(initialSummary, timelineEvents);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.75, 
        topP: 0.9,
        topK: 40,
      }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) { 
      jsonStr = match[2].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr);
      if (!validateNextChoiceForksResponse(parsedData)) {
        console.error("Parsed next choice forks data missing crucial fields or has incorrect types:", parsedData);
        throw new Error("Next choice forks result from AI is incomplete or malformed.");
      }
      return parsedData.next_choice_forks;
    } catch (e: any) {
      console.error("Failed to parse JSON response for next choice forks from Gemini or validation failed:", e);
      console.error("Raw response text for next choice forks:", response.text); 
      throw new Error(`Could not understand the next choice forks from AI. ${e.message}. Raw response snippet: ${response.text.substring(0,100)}...`);
    }

  } catch (error:any) {
    console.error("Error calling Gemini API for next choice forks:", error);
    if (error.message && error.message.includes("API key not valid")) {
      throw new Error("Invalid Gemini API Key for next choice forks. Please check your API_KEY environment variable.");
    }
    throw new Error(error.message || "An error occurred while communicating with the AI service for next choice forks.");
  }
};
