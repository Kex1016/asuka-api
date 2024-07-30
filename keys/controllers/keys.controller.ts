import express from "express";
import KeysService from "../services/keys.service.ts";
import debug from 'debug';

const log: debug.IDebugger = debug('app:keys-controller');

class KeysController {
    async listKeys(req: express.Request, res: express.Response) {
        const submissions = await KeysService.list(100, 0);
        res.status(200).send(submissions);
    }

    async getKeyById(req: express.Request, res: express.Response) {
        const submission = await KeysService.readById(req.params.submissionId);
        res.status(200).send(submission);
    }

    async createKey(req: express.Request, res: express.Response) {
        const submissionId = await KeysService.create(req.body);
        res.status(201).send({ id: submissionId });
    }

    async patchKey(req: express.Request, res: express.Response) {
        const submissionId = await KeysService.patchById(req.params.submissionId, req.body);
        res.status(200).send({ id: submissionId });
    }

    async putKey(req: express.Request, res: express.Response) {
        const submissionId = await KeysService.putById(req.params.submissionId, req.body);
        res.status(200).send({ id: submissionId });
    }

    async removeKey(req: express.Request, res: express.Response) {
        const response = await KeysService.deleteById(req.params.submissionId);
        res.status(204).send(response);
    }
}

export default new KeysController();