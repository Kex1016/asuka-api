import express from 'express'
import {CommonRoutesConfig} from '../common/common.routes.config.ts'
import SubmissionsController from "./controllers/submissions.controller.ts";
import SubmissionsMiddleware from "./middleware/submissions.middleware.ts";

export class SubmissionsRoutesConfig extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'SubmissionsRoutes')
    }

    configureRoutes(): express.Application {
        this.app.route(`/submissions`)
            .get(SubmissionsController.listSubmissions)
            .post(
                SubmissionsMiddleware.validateRequiredSubmissionBodyFields,
                SubmissionsMiddleware.validateMoreThanTwoSubmissionsPerUser,
                SubmissionsController.createSubmission
            )

        this.app.route(`/submissions/:submissionId`)
            .all(SubmissionsMiddleware.validateSubmissionExists)
            .get(SubmissionsController.getSubmissionById)
            .put(
                SubmissionsMiddleware.validateRequiredSubmissionBodyFields,
                SubmissionsController.put
            )
            .patch(SubmissionsController.patch)
            .delete(SubmissionsController.removeSubmission)

        return this.app
    }
}