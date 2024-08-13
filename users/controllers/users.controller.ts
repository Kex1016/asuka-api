import express from "express";
import UsersService from "../services/users.service.ts";
import argon2 from 'argon2';
import debug from 'debug';

const log: debug.IDebugger = debug('app:users-controller');

class UsersController {
    async listUsers(req: express.Request, res: express.Response) {
        const submissions = await UsersService.list(100, 0);
        res.status(200).send(submissions);
    }

    async getUserById(req: express.Request, res: express.Response) {
        const submission = await UsersService.readById(req.params.userId);
        res.status(200).send(submission);
    }

    async createUser(req: express.Request, res: express.Response) {
        req.body.password = await argon2.hash(req.body.password);
        const userId = await UsersService.create(req.body);
        res.status(201).send({id: userId});
    }

    async patchUser(req: express.Request, res: express.Response) {
        if (req.body.password) {
            req.body.password = await argon2.hash(req.body.password);
        }
        log(await UsersService.patchById(req.params.userId, req.body));
        res.status(204).send();
    }

    async putUser(req: express.Request, res: express.Response) {
        req.body.password = await argon2.hash(req.body.password);
        log(await UsersService.putById(req.params.userId, req.body));
        res.status(204).send();
    }

    async removeUser(req: express.Request, res: express.Response) {
        log(await UsersService.deleteById(req.params.userId));
        res.status(204).send();
    }
}

export default new UsersController();
