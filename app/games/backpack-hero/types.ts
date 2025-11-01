export interface Item {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

export interface DisasterScenario {
  name: string;
  description: string;
  emoji: string;
  correctItems: string[];
  timeLimit: number;
}
