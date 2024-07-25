export interface CreateSubmissionDto {
  id: string;
  name: string;
  image: string;
  suggestedBy: string;
  messageId?: string;
  accepted?: boolean;
  used?: boolean;
  prev: boolean;
}