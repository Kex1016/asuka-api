import express from "express";
import KeysService from "../../keys/services/keys.service.ts";

class AuthMiddleware {
    async verifyKey(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const keyHeader = req.headers['x-api-key'];
        if (!keyHeader) {
            res.status(401).send({
                error: `API Key is required`,
            });
            return;
        }

        if (typeof keyHeader !== 'string') {
            res.status(401).send({
                error: `Invalid API Key`,
            });
            return;
        }

        const key = await KeysService.getByKey(keyHeader);
        if (key.length > 0) {
            next();
        } else {
            res.status(401).send({
                error: `Invalid API Key`,
            });
        }
    }
}

export default new AuthMiddleware();