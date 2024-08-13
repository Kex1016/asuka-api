export interface CreateUserDto {
    username: string;
    password: string;
    discordId: string;
    permissionFlags: number;
}
