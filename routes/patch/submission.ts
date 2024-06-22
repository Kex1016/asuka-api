import SubmissionEntry from "../../models/SubmissionEntry.ts";
import {validateAuthHeaders} from "../../util/getAuth.ts";
import path from 'path';
import {$} from 'bun';
import SubmissionVote from "../../models/SubmissionVote.ts";
import logger from "../../util/logger.ts";

/**
 * Patch a single submission.
 * The id of the submission is expected to be passed as a query parameter.
 * @param req
 */
export async function patchSubmission(req: Request): Promise<Response> {
    logger.debug("Validating auth headers");
    if (!await validateAuthHeaders(req)) {
        logger.debug("Unauthorized");
        return new Response('Unauthorized', {status: 401});
    }

    logger.debug("Parsing the request");
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const name = url.searchParams.get('name');
    const image = url.searchParams.get('image');
    const messageId = url.searchParams.get('messageId');
    const accepted = url.searchParams.get('accepted');
    const used = url.searchParams.get('used');

    if (!id) {
        logger.debug("Bad request, missing parameters");
        return new Response('Bad request', {status: 400});
    }

    const submission = await SubmissionEntry.findByPk(parseInt(id));
    if (!submission) {
        logger.debug("Submission not found");
        return new Response('Not found', {status: 404});
    }

    if (image) {
        // Download the image
        logger.debug("Downloading image");
        const imageOriginalURL = new URL(image);
        const imageBuffer = await (await fetch(imageOriginalURL)).arrayBuffer();
        if (!imageBuffer) {
            logger.debug("Bad request, image not found");
            return new Response('Bad request', {status: 400});
        }
        const pwd = await $`echo $PWD`.text();

        const imageName = imageOriginalURL.pathname.split('/').pop();
        if (!imageName) {
            logger.debug("Bad request, image name not found");
            return new Response('Bad request', {status: 400});
        }

        const imageExtension = path.extname(imageName);
        const random = Math.floor(Math.random() * 1000000);
        const nameFormatted = (name ? name : submission.name).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const newName = `${nameFormatted}_${random}${imageExtension}`;
        const imagePath = path.join(pwd.replaceAll("\n", ""), "public/images", newName)

        const imageFile = Bun.file(imagePath);
        try {
            imageFile.writer().write(imageBuffer);
        } catch (e) {
            logger.debug("Error saving image", e);
            return new Response('Internal server error', {status: 500});
        }

        submission.image = newName;
    }

    if (name) {
        logger.debug("Updating the name");
        submission.name = name;
    }

    if (messageId) {
        logger.debug("Updating the message id");
        submission.messageId = messageId;
    }

    if (accepted) {
        logger.debug("Updating the accepted status");
        submission.accepted = accepted === 'true';
    }

    if (used) {
        logger.debug("Updating the used status");
        submission.used = used === 'true';
    }

    try {
        logger.debug("Saving the submission");
        await submission.save();
    } catch (e) {
        logger.debug("Error saving the submission", e);
        return new Response('Internal server error', {status: 500});
    }

    return new Response(JSON.stringify(submission), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });
}

/**
 * Patch a single vote.
 * @param req
 */
export async function patchSubmissionVote(req: Request) {
    logger.debug("Validating auth headers");
    if (!await validateAuthHeaders(req)) {
        logger.debug("Unauthorized");
        return new Response('Unauthorized', {status: 401});
    }

    logger.debug("Parsing the request");
    const url = new URL(req.url);
    const voteId = url.searchParams.get('id');
    const value = url.searchParams.get('value');

    if (!voteId) {
        logger.debug("Bad request, missing parameters");
        return new Response('Bad request', {status: 400});
    }

    logger.debug("Getting the vote object");
    const submissionVote = await SubmissionVote.findByPk(parseInt(voteId));

    if (!submissionVote) {
        logger.debug("Vote not found");
        return new Response('Not found', {status: 404});
    }

    if (value) {
        try {
            parseInt(value)
        } catch (e) {
            logger.debug("Bad request, invalid value");
            return new Response('Bad request', {status: 400});
        }

        logger.debug("Updating the value");
        submissionVote.value = parseInt(value);
    }

    try {
        logger.debug("Saving the vote");
        await submissionVote.save();
    } catch (e) {
        logger.debug("Error saving the vote", e);
        return new Response('Bad request', {status: 400});
    }

    return new Response(JSON.stringify(submissionVote), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });
}