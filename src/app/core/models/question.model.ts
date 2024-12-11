export interface QuestionsAvailable {
  id: number;
  question: string;
  type: number;
  required: boolean;
  placeholder: string;
  requiredQuestionId: number;
  isCompleted?: boolean;
}
