export interface PutSubmissionDto {
  name: string;
  image: string;
  suggestedBy: string;
  messageId: string;
  accepted: boolean;
  used: boolean;
  won: boolean;
  createdAt: Date;
}