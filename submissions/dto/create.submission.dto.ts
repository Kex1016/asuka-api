export interface CreateSubmissionDto {
  name: string;
  image: string;
  suggestedBy: string;
  messageId?: string;  // Voting message ID
  accepted?: boolean;  // Whether the submission was accepted
  used?: boolean;      // Whether the submission was used
  won: boolean;        // Whether the submission won the voting that week (default false)
}