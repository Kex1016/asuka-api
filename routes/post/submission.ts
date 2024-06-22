import SubmissionEntry from "../../models/SubmissionEntry.ts";
import {validateAuthHeaders} from "../../util/getAuth.ts";
import path from 'path';
import {$} from 'bun';
import SubmissionVote from "../../models/SubmissionVote.ts";
import logger from "../../util/logger.ts";

/**
 * Post a single submission.
 * The id of the submission is expected to be passed as a query parameter.
 * @param req
 */
export async function postSubmission(req: Request): Promise<Response> {
    logger.debug("Validating auth headers");
    if (!await validateAuthHeaders(req)) {
        logger.debug("Unauthorized");
        return new Response('Unauthorized', {status: 401});
    }

    logger.debug("Parsing the request");
    const url = new URL(req.url);
    const name = url.searchParams.get('name');
    const image = url.searchParams.get('image');
    const suggestedBy = url.searchParams.get('suggestedBy');
    if (!name || !image || !suggestedBy) {
        logger.debug("Bad request, missing parameters");
        return new Response('Bad request', {status: 400});
    }

    const submissionEntries = await SubmissionEntry.findAll(
        {
            where: {
                name: name,
                image: image
            }
        }
    );

    if (submissionEntries.length !== 0) {
        logger.debug("The submission already exists");
        return new Response('Already exists', {status: 409});
    }

    // Download the image
    logger.debug("Downloading image");
    const imageOriginalURL = new URL(image);
    // https://cdn.discordapp.com/ephemeral-attachments/1249733499355926570/1249736728470622248/THIS_CAN_BE_ANYTHING.jpg?ex=66686387&is=66671207&hm=6fc871d5dea2d2aa0260208d21684772e5634a3ca753b6d7b0353f17c348a466&
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
    const nameFormatted = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const newName = `${nameFormatted}_${random}${imageExtension}`;
    const imagePath = path.join(pwd.replaceAll("\n", ""), "public/images", newName)

    const imageFile = Bun.file(imagePath);
    try {
        imageFile.writer().write(imageBuffer);
    } catch (e) {
        logger.debug("Error saving image", e);
        return new Response('Internal server error', {status: 500});
    }

    // Save the submission
    logger.debug("Saving the submission");
    const submissionEntry = new SubmissionEntry();
    submissionEntry.name = name;
    submissionEntry.image = newName;
    submissionEntry.suggestedBy = suggestedBy;

    try {
        await submissionEntry.save();
    } catch (e) {
        logger.debug("Error saving the submission", e);
        return new Response('Internal server error', {status: 500});
    }

    return new Response(JSON.stringify(submissionEntry), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });
}

export async function postSubmissionVote(req: Request) {
    logger.debug("Validating auth headers");
    if (!await validateAuthHeaders(req)) {
        logger.debug("Unauthorized");
        return new Response('Unauthorized', {status: 401});
    }

    logger.debug("Parsing the request");
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const submissionId = url.searchParams.get('submissionId');
    const value = url.searchParams.get('value');
    if (!submissionId || !value || !userId) {
        logger.debug("Bad request, missing parameters");
        return new Response('Bad request', {status: 400});
    }

    try {
        parseInt(submissionId)
        parseInt(value)
    } catch (e) {
        logger.debug("Bad request, invalid submission id or value");
        return new Response('Bad request', {status: 400});
    }

    logger.debug("Checking if the submission exists");
    const submissionEntry = await SubmissionEntry.findByPk(parseInt(submissionId));
    if (!submissionEntry) {
        logger.debug("Submission not found");
        return new Response('Not found', {status: 404});
    }

    logger.debug("Creating the vote object");
    const submissionVote = new SubmissionVote();
    submissionVote.userId = userId;
    submissionVote.submissionId = parseInt(submissionId);
    submissionVote.value = parseInt(value);

    try {
        logger.debug("Saving the vote");
        await submissionVote.save();
    } catch (e) {
        const existingVote = await SubmissionVote.findOne({
            where: {
                userId: userId,
                submissionId: submissionId
            }
        });

        if (existingVote) {
            logger.debug("The user already voted");
            return new Response('Already voted', {status: 409});
        }

        logger.debug("Error saving the vote", e);
        return new Response('Bad request', {status: 400});
    }

    return new Response(JSON.stringify(submissionVote), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });
}