import {validateAuthHeaders} from "../../util/getAuth.ts";
import logger from "../../util/logger.ts";
import EventEntry from "../../models/EventEntry.ts";
import EventParticipant from "../../models/EventParticipant.ts";

/**
 * Delete a single event.
 * The id of the event is expected to be passed as a query parameter.
 * @param req
 */
export async function deleteEvent(req: Request): Promise<Response> {
    logger.debug("Validating auth headers");
    if (!await validateAuthHeaders(req)) {
        logger.debug("Unauthorized");
        return new Response('Unauthorized', {status: 401});
    }

    logger.debug("Parsing the request");
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
        logger.debug("Bad request, missing parameters");
        return new Response('Bad request', {status: 400});
    }

    const event = await EventEntry.findByPk(parseInt(id));
    if (!event) {
        logger.debug("Event not found");
        return new Response('Not found', {status: 404});
    }

    try {
        logger.debug("Deleting the event and its participants");
        const participants = await EventParticipant.findAll({where: {eventId: event.id}});
        for (const participant of participants) {
            await participant.destroy();
        }
        await event.destroy();
    } catch (e) {
        logger.debug("Error deleting the event", e);
        return new Response('Internal server error', {status: 500});
    }

    return new Response(JSON.stringify(event), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });
}

/**
 * Delete a single event participant.
 * The id of the participant is expected to be passed as a query parameter.
 * @param req
 */
export async function deleteEventParticipant(req: Request) {
    logger.debug("Validating auth headers");
    if (!await validateAuthHeaders(req)) {
        logger.debug("Unauthorized");
        return new Response('Unauthorized', {status: 401});
    }

    logger.debug("Parsing the request");
    const url = new URL(req.url);
    const participantId = url.searchParams.get('id');

    if (!participantId) {
        logger.debug("Bad request, missing parameters");
        return new Response('Bad request', {status: 400});
    }

    logger.debug("Getting the participant object");
    const participant = await EventParticipant.findByPk(parseInt(participantId));

    if (!participant) {
        logger.debug("Vote not found");
        return new Response('Not found', {status: 404});
    }

    try {
        logger.debug("Deleting the participant");
        await participant.destroy();
    } catch (e) {
        logger.debug("Error deleting participant", e);
        return new Response('Bad request', {status: 400});
    }

    return new Response(JSON.stringify(participant), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });
}