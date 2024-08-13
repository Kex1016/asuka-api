import express from "express";
import UsersService from "../services/users.service.ts";
import debug from 'debug';

const log: debug.IDebugger = debug('app:users-controller');

class UsersMiddleware {
    async validateSameUsernameDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await UsersService.readByUsername(req.body.username);
        if (user) {
            res.status(400).send({error: `Username already exists`});
        } else {
            next();
        }
    }

    async validateSameDiscordIdDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await UsersService.readByDiscordId(req.body.discordId);
        if (user) {
            res.status(400).send({error: `Discord ID already exists`});
        } else {
            next();
        }
    }

    validatePatchUsername = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (req.body.username) {
            log('Validating username', req.body.username);
            this.validateSameUsernameDoesntExist(req, res, next);
        } else {
            next();
        }
    }

    async validateUserExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await UsersService.readById(req.params.userId);
        if (user) {
            res.locals.user = user;
            next();
        } else {
            res.status(404).send({
                error: `User ${req.params.userId} not found`,
            });
        }
    }

    async extractUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.userId;
        next();
    }

    async userCantChangePermission(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (
            'permissionFlags' in req.body &&
            req.body.permissionFlags !== res.locals.user.permissionFlags
        ) {
            res.status(400).send({
                errors: ['User cannot change permission flags'],
            });
        } else {
            next();
        }
    }
}

export default new UsersMiddleware();
