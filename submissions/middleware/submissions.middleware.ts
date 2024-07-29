import express from "express";
import submissionsService from "../services/submissions.service.ts";
import debug from 'debug';

const log: debug.IDebugger = debug('app:submissions-controller');

class SubmissionsMiddleware {
    async validateRequiredSubmissionBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.name && req.body.image) {
            next();
        } else {
            res.status(400).send({
                error: `Missing required fields name and image`,
            });
        }
    }

    async validateMoreThanTwoSubmissionsPerUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const submissions = await submissionsService.getByUserId(req.body.submittedBy);
        if (submissions.length > 2) {
            res.status(400).send({error: `Cannot submit more than two submissions per user`});
        } else {
            next();
        }
    }

    // async validatePatchVsPutRequest(
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction
    // ) {
    //     if (req.method === 'PUT') {
    //         res.status(400).send({error: `Use PATCH instead`});
    //     } else {
    //         next();
    //     }
    // } // This is left here in case I need to use it later

    async validateSubmissionExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const submission = await submissionsService.readById(req.params.submissionId);
        if (submission) {
            next();
        } else {
            res.status(404).send({
                error: `Submission ${req.params.submissionId} not found`,
            });
        }
    }
}

export default new SubmissionsMiddleware();