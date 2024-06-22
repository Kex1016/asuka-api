import SubmissionEntry from "../../models/SubmissionEntry.ts";
import {validateAuthHeaders} from "../../util/getAuth.ts";
import path from 'path';
import {$} from 'bun';
import SubmissionVote from "../../models/SubmissionVote.ts";
import logger from "../../util/logger.ts";

/**
 * Delete a single submission.
 * The id of the submission is expected to be passed as a query parameter.
 * @param req
 */
export async function deleteSubmission(req: Request): Promise<Response> {
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

    const submission = await SubmissionEntry.findByPk(parseInt(id));
    if (!submission) {
        logger.debug("Submission not found");
        return new Response('Not found', {status: 404});
    }

    try {
        logger.debug("Deleting the submission and its votes");
        const votes = await SubmissionVote.findAll({where: {submissionId: submission.id}});
        for (const vote of votes) {
            await vote.destroy();
        }
        await submission.destroy();
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
 * Delete a single vote.
 * The id of the vote is expected to be passed as a query parameter.
 * @param req
 */
export async function deleteSubmissionVote(req: Request) {
    logger.debug("Validating auth headers");
    if (!await validateAuthHeaders(req)) {
        logger.debug("Unauthorized");
        return new Response('Unauthorized', {status: 401});
    }

    logger.debug("Parsing the request");
    const url = new URL(req.url);
    const voteId = url.searchParams.get('id');

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

    try {
        logger.debug("Deleting the vote");
        await submissionVote.destroy();
    } catch (e) {
        logger.debug("Error saving the vote", e);
        return new Response('Bad request', {status: 400});
    }

    return new Response(JSON.stringify(submissionVote), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });
}