import express from 'express'
import {CommonRoutesConfig} from '../common/common.routes.config.ts'
import {body} from "express-validator";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware.ts";
import KeysController from "./controllers/keys.controller.ts";
import KeysMiddleware from "./middleware/keys.middleware.ts";

export class KeysRoutesConfig extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'KeysRoutes')
    }

    configureRoutes(): express.Application {
        this.app.route(`/keys`)
            .get(KeysController.listKeys)
            .post(
                body('userId').isString().isLength({
                    min: 18,
                    max: 18
                }).withMessage('Must be a valid Discord user ID'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                KeysMiddleware.validateUserHasKey,
                KeysController.createKey
            )

        this.app.route(`/keys/:keyId`)
            .all(KeysMiddleware.validateKeyExists)
            .get(KeysController.getKeyById)
            .put(
                body('userId').isString().isLength({
                    min: 18,
                    max: 18
                }).withMessage('Must be a valid Discord user ID'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                KeysController.putKey
            )
            .patch(
                body('userId').isString().isLength({
                    min: 18,
                    max: 18
                }).withMessage('Must be a valid Discord user ID').optional(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                KeysController.patchKey
            )
            .delete(KeysController.removeKey)

        return this.app
    }
}