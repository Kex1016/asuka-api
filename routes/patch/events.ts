import {validateAuthHeaders} from "../../util/getAuth.ts";
import logger from "../../util/logger.ts";
import EventEntry from "../../models/EventEntry.ts";

/**
 * Patch a single event.
 * The id of the event is expected to be passed as a query parameter.
 * @param req
 */
export async function patchEvent(req: Request): Promise<Response> {
    logger.debug("Validating auth headers");
    if (!await validateAuthHeaders(req)) {
        logger.debug("Unauthorized");
        return new Response('Unauthorized', {status: 401});
    }

    logger.debug("Parsing the request");
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const name = url.searchParams.get('name');
    const messageId = url.searchParams.get('messageId');
    const description = url.searchParams.get('description');
    const location = url.searchParams.get('location');
    const date = url.searchParams.get('date');

    if (!id) {
        logger.debug("Bad request, missing parameters");
        return new Response('Bad request', {status: 400});
    }

    const event = await EventEntry.findByPk(parseInt(id));
    if (!event) {
        logger.debug("Event not found");
        return new Response('Not found', {status: 404});
    }

    if (name) {
        logger.debug("Updating the name");
        event.name = name;
    }

    if (description) {
        logger.debug("Updating the description");
        event.description = description;
    }

    if (location) {
        logger.debug("Updating the location");
        event.location = location;
    }

    if (date) {
        logger.debug("Updating the date");
        event.date = new Date(date);
    }

    if (messageId) {
        logger.debug("Updating the message id");
        event.messageId = messageId;
    }

    try {
        logger.debug("Saving the event");
        await event.save();
    } catch (e) {
        logger.debug("Error saving the event", e);
        return new Response('Internal server error', {status: 500});
    }

    return new Response(JSON.stringify(event), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });
}