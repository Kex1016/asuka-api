import { Model, DataTypes } from 'sequelize';
import sequelize from '../util/initDb.ts';

class EventEntry extends Model {
    declare id: number;
    declare name: string;
    declare messageId: string;
    declare description: string;
    declare location: string;
    declare date: Date;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

EventEntry.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new DataTypes.STRING(100),
        allowNull: false,
    },
    messageId: {
        type: new DataTypes.STRING(100),
        allowNull: true,
    },
    description: {
        type: new DataTypes.STRING(1000),
        allowNull: false,
    },
    location: {
        type: new DataTypes.STRING(100),
        allowNull: false,
    },
    date: {
        type: new DataTypes.DATE(),
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
    tableName: 'events',
    sequelize, // passing the `sequelize` instance is required
});

export default EventEntry;