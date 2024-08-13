import UsersDao from "../dao/users.dao.ts";
import type {CRUD} from '../../common/interfaces/crud.interface.ts'
import type {CreateUserDto} from "../dto/create.user.dto.ts";
import type {PatchUserDto} from "../dto/patch.user.dto.ts";
import type {PutUserDto} from "../dto/put.user.dto.ts";

class UsersService implements CRUD {
    async create(resource: CreateUserDto): Promise<any> {
        return UsersDao.addUser(resource)
    }

    async deleteById(id: string): Promise<any> {
        return UsersDao.removeUserById(id)
    }

    async list(limit: number, page: number): Promise<any> {
        return UsersDao.getUsers(limit, page)
    }

    async patchById(id: string, resource: PatchUserDto): Promise<any> {
        return UsersDao.updateUserById(id, resource)
    }

    async putById(id: string, resource: PutUserDto): Promise<any> {
        return UsersDao.updateUserById(id, resource)
    }

    async readById(id: string): Promise<any> {
        return UsersDao.getUserById(id)
    }

    async readByUsername(username: string): Promise<any> {
        return UsersDao.getUserByUsername(username)
    }

    async readByDiscordId(discordId: string): Promise<any> {
        return UsersDao.getUserByDiscordId(discordId)
    }

    async readByUsernameWithPassword(username: string) {
        return UsersDao.getUserByUsernameWithPassword(username);
    }
}

export default new UsersService()
