import MongooseService from "../../common/services/mongoose.service.ts";

import {type CreateUserDto} from '../dto/create.user.dto.ts'

import {nanoid} from 'nanoid'
import debug from 'debug'
import type {PatchUserDto} from "../dto/patch.user.dto.ts";
import type {PutUserDto} from "../dto/put.user.dto.ts";

const log: debug.IDebugger = debug('app:users-dao')

class UsersDao {
    Schema = MongooseService.getMongoose().Schema;
    userSchema = new this.Schema({
        _id: String,
        username: String,
        password: {type: String, select: false},
        discordId: String,
        permissionFlags: Number,
    }, {
        id: false,
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    });

    User = MongooseService.getMongoose().model('Keys', this.userSchema);

    constructor() {
        log('Created new instance of UsersDao')
    }

    async addUser(userFields: CreateUserDto) {
        const userId = nanoid(10)
        const user = new this.User({
            _id: userId,
            ...userFields,
            permissionFlags: 1
        });

        await user.save()
        return userId
    }

    async getUsers(limit = 25, page = 0) {
        return this.User.find()
            .limit(limit)
            .skip(limit * page)
            .exec()
    }

    async getUserById(userId: string) {
        // Find the user either by their ID or their Discord ID
        return this.User.findOne({
            $or: [
                {_id: userId},
                {discordId: userId}
            ]
        }).exec()
    }

    async getUserByUsernameWithPassword(username: string) {
        return this.User.findOne(
            {username: username},
            '+password'
        ).exec()
    }

    async getUserByUsername(username: string) {
        return this.User.findOne({username: username}).exec()
    }

    async getUserByDiscordId(discordId: string) {
        return this.User.findOne({discordId: discordId}).exec()
    }

    async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
        return await this.User.findOneAndUpdate(
            {_id: userId},
            {$set: userFields},
            {new: true}
        ).exec()
    }

    async removeUserById(userId: string) {
        return this.User.deleteOne({_id: userId}).exec()
    }
}

export default new UsersDao()
