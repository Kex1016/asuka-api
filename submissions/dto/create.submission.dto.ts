export interface CreateSubmissionDto {
  id: number;
  name: string;
  image: string;
  suggestedBy: string;
  messageId?: string;
  accepted?: boolean;
  used?: boolean;
  prev: boolean;
}