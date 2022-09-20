import { Database } from './DatabaseDefinitions';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Answer = Database['public']['Tables']['answers']['Row'];
export type AnswerSet = Database['public']['Tables']['answer_sets']['Row'];
export type Question = Database['public']['Tables']['questions']['Row'];
export type Questionnaire = Database['public']['Tables']['questionnaires']['Row'];
