import {Sequelize} from "sequelize";
import logger from "./logger.ts";

if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST || !process.env.DB_DATABASE) {
    throw new Error("Missing database environment variables");
}

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const database = process.env.DB_DATABASE;

const sequelize = new Sequelize(`mysql://${user}:${password}@${host}/${database}`, {
    logging: logger.debug.bind(logger),
});

export default sequelize;