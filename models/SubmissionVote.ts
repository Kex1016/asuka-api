import { Model, DataTypes } from 'sequelize';
import sequelize from '../util/initDb.ts';

class SubmissionVote extends Model {
    declare id: number;
    declare submissionId: number;
    declare userId: string;
    declare value: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

SubmissionVote.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    submissionId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: new DataTypes.DATE(),
        allowNull: false,
    },
    updatedAt: {
        type: new DataTypes.DATE(),
        allowNull: false,
    },
}, {
    tableName: 'votes',
    sequelize, // passing the `sequelize` instance is required
});

export default SubmissionVote;