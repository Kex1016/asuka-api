import { Model, DataTypes } from 'sequelize';
import sequelize from '../util/initDb.ts';

class EventParticipant extends Model {
    declare id: number;
    declare eventId: number;
    declare userId: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

EventParticipant.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    eventId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    userId: {
        type: new DataTypes.STRING(100),
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
    tableName: 'event_participants',
    sequelize, // passing the `sequelize` instance is required
});

export default EventParticipant;