import {Model, DataTypes} from 'sequelize';
import sequelize from '../util/initDb.ts';

class SubmissionEntry extends Model {
    declare id: number;
    declare name: string;
    declare image: string;
    declare suggestedBy: string;
    declare messageId: string;
    declare accepted: boolean;
    declare used: boolean;
    declare prev: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

SubmissionEntry.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    suggestedBy: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    messageId: {
        type: new DataTypes.STRING(128),
        allowNull: true,
    },
    accepted: {
        type: new DataTypes.BOOLEAN(),
        allowNull: true,
    },
    used: {
        type: new DataTypes.BOOLEAN(),
        allowNull: true,
    },
    prev: {
        type: new DataTypes.BOOLEAN(),
        allowNull: true,
    },
    image: {
        type: new DataTypes.STRING(128),
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
    tableName: 'submissions',
    sequelize, // passing the `sequelize` instance is required
});

export default SubmissionEntry;