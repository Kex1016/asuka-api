export interface CreateKeyDto {
    key: string;
    permissionFlags: number;
    createdBy: string;
    createdAt: Date;
}