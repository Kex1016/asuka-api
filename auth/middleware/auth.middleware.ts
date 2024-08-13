import express from "express";
import UsersService from "../../users/services/users.service.ts";
import argon2 from "argon2";

class AuthMiddleware {
    async verifyUserPassword(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user: any = await UsersService.readByUsernameWithPassword(
            req.body.username
        );
        if (user) {
            const passwordHash = user.password;
            if (await argon2.verify(passwordHash, req.body.password)) {
                req.body = {
                    userId: user._id,
                    username: user.username,
                    permissionFlags: user.permissionFlags,
                };
                return next();
            }
        }
        // Giving the same message in both cases
        // helps protect against cracking attempts:
        res.status(400).send({ errors: ['Invalid username and/or password'] });
    }
}

export default new AuthMiddleware();