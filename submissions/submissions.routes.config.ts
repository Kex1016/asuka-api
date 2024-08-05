import express from 'express'
import {CommonRoutesConfig} from '../common/common.routes.config.ts'
import SubmissionsController from "./controllers/submissions.controller.ts";
import SubmissionsMiddleware from "./middleware/submissions.middleware.ts";
import {body} from "express-validator";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware.ts";

export class SubmissionsRoutesConfig extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'SubmissionsRoutes')
    }

    configureRoutes(): express.Application {
        this.app.route(`/submissions`)
            .get(SubmissionsController.listSubmissions)
            .post(
                body('name').isString(),
                body('image').isString(),
                body('suggestedBy').isString().isLength({
                    min: 18,
                    max: 18
                }).withMessage('Must be a valid Discord user ID'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                SubmissionsMiddleware.validateMoreThanTwoSubmissionsPerUser,
                SubmissionsController.createSubmission
            )

        this.app.route(`/submissions/:submissionId`)
            .all(SubmissionsMiddleware.validateSubmissionExists)
            .get(SubmissionsController.getSubmissionById)
            .put(
                body('name').isString(),
                body('image').isString(),
                body('suggestedBy').isString().isLength({
                    min: 18,
                    max: 18
                }).withMessage('Must be a valid Discord user ID'),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                SubmissionsController.put
            )
            .patch(
                body('name').isString().optional(),
                body('image').isString().optional(),
                body('suggestedBy').isString().isLength({
                    min: 18,
                    max: 18
                }).withMessage('Must be a valid Discord user ID').optional(),
                BodyValidationMiddleware.verifyBodyFieldsErrors,
                SubmissionsController.patch
            )
            .delete(SubmissionsController.removeSubmission)

        return this.app
    }
}