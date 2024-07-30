import express from "express";
import KeysService from "../services/keys.service.ts";
import debug from 'debug';

const log: debug.IDebugger = debug('app:keys-controller');

class KeysMiddleware {
    async validateKeyExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const key = await KeysService.readById(req.params.keyId);
        if (key) {
            next();
        } else {
            res.status(404).send({
                error: `Key ${req.params.keyId} not found`,
            });
        }
    }

    async validateUserHasKey(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const keys = await KeysService.getByUserId(req.body.createdBy);
        if (keys.length > 0) {
            res.status(400).send({error: `User ${req.body.createdBy} already has a key`});
        } else {
            next();
        }
    }
}

export default new KeysMiddleware();