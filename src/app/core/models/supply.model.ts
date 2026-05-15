export interface Topic {
  title: string;
  items: string[];
}

export interface Supply {
  id: string;
  pillar: string;
  module: string;
  userId: string;
  topics: Topic[];
}
