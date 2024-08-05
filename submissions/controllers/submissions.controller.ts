import express from "express";
import SubmissionsService from "../services/submissions.service.ts";
import debug from 'debug';

const log: debug.IDebugger = debug('app:submissions-controller');

class SubmissionsController {
    async listSubmissions(req: express.Request, res: express.Response) {
        const submissions = await SubmissionsService.list(100, 0);
        res.status(200).send(submissions);
    }

    async getSubmissionById(req: express.Request, res: express.Response) {
        const submission = await SubmissionsService.readById(req.body.id);
        res.status(200).send(submission);
    }

    async createSubmission(req: express.Request, res: express.Response) {
        const submissionId = await SubmissionsService.create(req.body);
        res.status(201).send({ id: submissionId });
    }

    async put(req: express.Request, res: express.Response) {
        log(await SubmissionsService.putById(req.body.id, req.body));
        res.status(204).send();
    }

    async patch(req: express.Request, res: express.Response) {
        log(await SubmissionsService.patchById(req.body.id, req.body));
        res.status(204).send();
    }

    async removeSubmission(req: express.Request, res: express.Response) {
        log(await SubmissionsService.deleteById(req.body.id));
        res.status(204).send();
    }
}

export default new SubmissionsController();