import {CommonRoutesConfig} from "../common/common.routes.config.ts";
import AuthController from "./controllers/auth.controller.ts";
import AuthMiddleware from "./middleware/auth.middleware.ts";
import express from "express";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware.ts";
import {body} from "express-validator";

export class AuthRoutesConfig extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'AuthRoutes');
    }

    configureRoutes(): express.Application {
        this.app.route(`/auth`)
            .post(
                body('key').isString().isLength({
                    min: 48,
                    max: 48
                }).withMessage('Must be a valid key'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                AuthMiddleware.verifyKey,
                AuthController.createJWT
            );

        return this.app;
    }
}