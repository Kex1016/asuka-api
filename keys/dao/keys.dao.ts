import MongooseService from "../../common/services/mongoose.service.ts";

import {type CreateKeyDto} from '../dto/create.key.dto.ts'

import {nanoid} from 'nanoid'
import debug from 'debug'
import type {PatchKeyDto} from "../dto/patch.key.dto.ts";
import type {PutKeyDto} from "../dto/put.key.dto.ts";

const log: debug.IDebugger = debug('app:keys-dao')

class KeysDao {
    Schema = MongooseService.getMongoose().Schema;
    keySchema = new this.Schema({
        _id: String,
        key: String,
        permissionFlags: Number,
        createdBy: String,
        createdAt: Date
    }, {id: false});

    Key = MongooseService.getMongoose().model('Keys', this.keySchema);

    constructor() {
        log('Created new instance of KeysDao')
    }

    async addKey(keyFields: CreateKeyDto) {
        const keyId = nanoid()
        const keyString = nanoid(48)
        const key = new this.Key({
            _id: keyId,
            key: keyString,
            createdBy: keyFields.createdBy,
            createdAt: new Date()
        });

        await key.save()
        return keyId
    }

    async getKeys(limit = 25, page = 0) {
        return this.Key.find()
            .limit(limit)
            .skip(limit * page)
            .exec()
    }

    async getKeyById(keyId: string) {
        return this.Key.findById(keyId).exec()
    }

    async getKeysByUserId(createdBy: string) {
        return this.Key.find({createdBy: createdBy}).exec()
    }

    async getKeyByKey(key: string) { // lol funny name
        return this.Key.find({key: key}).exec()
    }

    async updateKeyById(keyId: string, keyFields: PatchKeyDto | PutKeyDto) {
        const newKeyString = nanoid(48)
        return await this.Key.findOneAndUpdate(
            {_id: keyId},
            {
                $set: {
                    ...keyFields,
                    key: newKeyString
                }
            },
            {new: true}
        ).exec()
    }

    async removeKeyById(keyId: string) {
        return this.Key.deleteOne({_id: keyId}).exec()
    }
}

export default new KeysDao()