
export interface Delta {
  summary: string;
  triggers: string[]; // e.g. ["Seeking", "Performance Trap"]
}

export interface MessagePair {
  user: string;
  ai: string;
}
