import KeysDao from "../dao/keys.dao.ts";
import type {CRUD} from '../../common/interfaces/crud.interface.ts'
import type {CreateKeyDto} from "../dto/create.key.dto.ts";
import type {PatchKeyDto} from "../dto/patch.key.dto.ts";
import type {PutKeyDto} from "../dto/put.key.dto.ts";

class KeysService implements CRUD {
    async create(resource: CreateKeyDto): Promise<any> {
        return KeysDao.addKey(resource)
    }

    async deleteById(id: string): Promise<any> {
        return KeysDao.removeKeyById(id)
    }

    async list(limit: number, page: number): Promise<any> {
        return KeysDao.getKeys(limit, page)
    }

    async patchById(id: string, resource: PatchKeyDto): Promise<any> {
        return KeysDao.updateKeyById(id, resource)
    }

    async putById(id: string, resource: PutKeyDto): Promise<any> {
        return KeysDao.updateKeyById(id, resource)
    }

    async readById(id: string): Promise<any> {
        return KeysDao.getKeyById(id)
    }

    async getByUserId(userId: string): Promise<any> {
        return KeysDao.getKeysByUserId(userId)
    }

    async getByKey(key: string): Promise<any> {
        return KeysDao.getKeyByKey(key)
    }
}

export default new KeysService()