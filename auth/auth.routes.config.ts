import {CommonRoutesConfig} from "../common/common.routes.config.ts";
import AuthController from "./controllers/auth.controller.ts";
import AuthMiddleware from "./middleware/auth.middleware.ts";
import express from "express";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware.ts";
import {body} from "express-validator";
import JwtMiddleware from "./middleware/jwt.middleware.ts";

export class AuthRoutesConfig extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'AuthRoutes');
    }

    configureRoutes(): express.Application {
        this.app.route(`/auth`)
            .post(
                body('username').isString(),
                body('password').isString(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                AuthMiddleware.verifyUserPassword,
                AuthController.createJWT
            );

        this.app.post(`/auth/refresh-token`, [
            JwtMiddleware.validJWTNeeded,
            JwtMiddleware.verifyRefreshBodyField,
            JwtMiddleware.validRefreshNeeded,
            AuthController.createJWT,
        ]);

        return this.app;
    }
}