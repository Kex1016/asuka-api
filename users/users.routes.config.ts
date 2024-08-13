import express from 'express'
import {CommonRoutesConfig} from '../common/common.routes.config.ts'
import {body} from "express-validator";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware.ts";
import UsersController from "./controllers/users.controller.ts";
import UsersMiddleware from "./middleware/users.middleware.ts";
import JwtMiddleware from "../auth/middleware/jwt.middleware.ts";
import CommonPermissionMiddleware from "../common/middleware/common.permission.middleware.ts";
import {PermissionFlag} from "../common/middleware/common.permissionflag.enum.ts";

export class UsersRoutesConfig extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes')
    }

    configureRoutes(): express.Application {
        this.app.route(`/users`)
            .get(
                JwtMiddleware.validJWTNeeded,
                CommonPermissionMiddleware.permissionFlagRequired(
                    PermissionFlag.MODERATOR
                ),
                UsersController.listUsers
            )
            .post(
                body('password')
                    .isString()
                    .isLength({min: 5})
                    .withMessage('Must include password (5+ characters)'),
                body('discordId').isString(),
                body('username').isString(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                UsersMiddleware.validateSameUsernameDoesntExist,
                UsersMiddleware.validateSameDiscordIdDoesntExist,
                UsersController.createUser
            )

        this.app.route(`/users/:userId`)
            .all(
                UsersMiddleware.validateUserExists,
                JwtMiddleware.validJWTNeeded,
                CommonPermissionMiddleware.onlySameUserOrModCanDoThisAction
            )
            .get(UsersController.getUserById)
            .delete(UsersController.removeUser);

        this.app.param(`userId`, UsersMiddleware.extractUserId);

        this.app.route(`/users/:userId`).put(
            body('username').isString(),
            body('password')
                .isString()
                .isLength({min: 5})
                .withMessage('Must include password (5+ characters)'),
            body('permissionFlags').isInt(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            UsersMiddleware.validateSameUsernameDoesntExist,
            UsersController.putUser
        );

        this.app.route(`/users/:userId`).patch(
            body('username').isString().optional(),
            body('password')
                .isString()
                .isLength({min: 5})
                .withMessage('Password must be 5+ characters')
                .optional(),
            body('permissionFlags').isInt().optional(),
            BodyValidationMiddleware.verifyBodyFieldsErrors,
            UsersMiddleware.validatePatchUsername,
            UsersController.patchUser
        )

        return this.app
    }
}
