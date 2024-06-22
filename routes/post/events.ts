import {validateAuthHeaders} from "../../util/getAuth.ts";
import logger from "../../util/logger.ts";
import EventEntry from "../../models/EventEntry.ts";
import EventParticipant from "../../models/EventParticipant.ts";

/**
 * Post a single event.
 * The details of the event is expected to be passed as a query parameter.
 * @param req
 */
export async function postEvent(req: Request): Promise<Response> {
    logger.debug("Validating auth headers");
    if (!await validateAuthHeaders(req)) {
        logger.debug("Unauthorized");
        return new Response('Unauthorized', {status: 401});
    }

    logger.debug("Parsing the request");
    const url = new URL(req.url);
    const name = url.searchParams.get('name');
    const description = url.searchParams.get('description');
    const location = url.searchParams.get('location');
    const date = url.searchParams.get('date');
    if (!name || !description || !location || !date) {
        logger.debug("Bad request, missing parameters");
        return new Response('Bad request', {status: 400});
    }

    logger.debug("Creating the event object");
    const eventEntry = new EventEntry();
    eventEntry.name = name;
    eventEntry.description = description;
    eventEntry.location = location;

    // Parse the date
    logger.debug("Parsing the date");
    try {
        eventEntry.date = new Date(date);
    } catch (e) {
        logger.debug("Bad request, invalid date");
        return new Response('Bad request', {status: 400});
    }

    try {
        await eventEntry.save();
    } catch (e) {
        logger.debug("Error saving the submission", e);
        return new Response('Internal server error', {status: 500});
    }

    return new Response(JSON.stringify(eventEntry), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });
}

/**
 * Post a single event participant.
 * The details of the participant is expected to be passed as a query parameter.
 * @param req
 */
export async function postEventParticipant(req: Request) {
    logger.debug("Validating auth headers");
    if (!await validateAuthHeaders(req)) {
        logger.debug("Unauthorized");
        return new Response('Unauthorized', {status: 401});
    }

    logger.debug("Parsing the request");
    const url = new URL(req.url);
    const eventId = url.searchParams.get('eventId');
    const userId = url.searchParams.get('userId');
    if (!eventId || !userId) {
        logger.debug("Bad request, missing parameters");
        return new Response('Bad request', {status: 400});
    }

    logger.debug("Checking if the submission exists");
    const eventEntry = await EventEntry.findByPk(parseInt(eventId));
    if (!eventEntry) {
        logger.debug("Event not found");
        return new Response('Event not found', {status: 404});
    }

    logger.debug("Creating the vote object");
    const participant = new EventParticipant();
    try {
        participant.eventId = parseInt(eventId);
    } catch (e) {
        logger.debug("Bad request, invalid event id");
        return new Response('Bad request', {status: 400});
    }
    participant.userId = userId;

    try {
        logger.debug("Saving the vote");
        await participant.save();
    } catch (e) {
        const existingVote = await EventParticipant.findOne({
            where: {
                userId: userId,
                eventId: parseInt(eventId)
            }
        });

        if (existingVote) {
            logger.debug("The user already voted");
            return new Response('Already participating', {status: 409});
        }

        logger.debug("Error saving the vote", e);
        return new Response('Bad request', {status: 400});
    }

    return new Response(JSON.stringify(participant), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });
}