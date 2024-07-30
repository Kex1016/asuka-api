import express from "express";
import debug from "debug";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const log: debug.IDebugger = debug("app:auth-controller");

const jwtSecret = process.env.APP_SECRET || "changeme";
const jwtExpirySeconds = 60 * 60 * 24 * 7; // 7 days

class AuthController {
    async createJWT(req: express.Request, res: express.Response) {
        try {
            const refreshId = req.body.userId + jwtSecret;
            const salt = crypto.randomBytes(16).toString("base64");
            const hash = crypto
                .createHmac("sha512", salt)
                .update(refreshId)
                .digest("base64");
            req.body.refreshKey = salt;
            const token = jwt.sign(req.body, jwtSecret, {
                expiresIn: jwtExpirySeconds,
            });

            return res.status(201).send({accessToken: token, refreshToken: hash, expiresIn: jwtExpirySeconds});
        } catch (err) {
            log("createJWT error: %O", err);
            return res.status(500).send();
        }
    }
}

export default new AuthController();