import logger from "../../util/logger.ts";
import EventEntry from "../../models/EventEntry.ts";
import EventParticipant from "../../models/EventParticipant.ts";

/**
 * Get all events.
 * @param req
 */
export async function getAllEvents(req: Request): Promise<Response> {
    logger.debug("Getting all events");
    const events = await EventEntry.findAll();
    const participants = await EventParticipant.findAll();

    for (const event of events) {
        event.dataValues.participants = participants.filter(participant => participant.eventId === event.id);
    }

    return new Response(JSON.stringify(events), {status: 200, headers: {'Content-Type': 'application/json'}});
}

/**
 * Get a single event.
 * The id of the event is expected to be passed as a query parameter.
 * @param req
 */
export async function getEvent(req: Request): Promise<Response> {
    logger.debug("Parsing the request");
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
        return new Response('Bad request', {status: 400});
    }

    logger.debug("Getting the event");
    const event = await EventEntry.findByPk(id);
    const participants = await EventParticipant.findAll();

    if (!event) {
        return new Response('Not found', {status: 404});
    }

    event.dataValues.participants = participants.filter(participant => participant.eventId === event.id);

    return new Response(JSON.stringify(event), {status: 200, headers: {'Content-Type': 'application/json'}});
}

/**
 * Get all participants for an event.
 * @param req
 */
export async function getEventParticipants(req: Request): Promise<Response> {
    logger.debug("Parsing the request");
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
        return new Response('Bad request', {status: 400});
    }

    logger.debug("Getting the participants");
    const votes = await EventParticipant.findAll({
        where: {
            eventId: id
        }
    });

    return new Response(JSON.stringify(votes), {status: 200, headers: {'Content-Type': 'application/json'}});
}

/**
 * Get a single event participant.
 * The id of the participant and the event is expected to be passed as a query parameter.
 * @param req
 */
export async function getEventParticipant(req: Request): Promise<Response> {
    logger.debug("Parsing the request");
    const url = new URL(req.url);
    const eventId = url.searchParams.get('eventId');
    const userId = url.searchParams.get('userId');
    if (!eventId || !userId) {
        return new Response('Bad request', {status: 400});
    }

    logger.debug("Getting the participant");
    const participant = await EventParticipant.findOne({
        where: {
            eventId: eventId,
            userId: userId
        }
    });

    if (!participant) {
        return new Response('Not found', {status: 404});
    }

    return new Response(JSON.stringify(participant), {status: 200, headers: {'Content-Type': 'application/json'}});
}