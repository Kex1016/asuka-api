import SubmissionEntry from "../../models/SubmissionEntry.ts";
import {validateAuthHeaders} from "../../util/getAuth.ts";
import SubmissionVote from "../../models/SubmissionVote.ts";
import logger from "../../util/logger.ts";

/**
 * Get all submissions.
 * @param req
 */
export async function getAllSubmissions(req: Request): Promise<Response> {
    logger.debug("Getting all submissions");
    let submissions = await SubmissionEntry.findAll();
    const votes = await SubmissionVote.findAll();

    logger.debug("Parsing the request");
    const url = new URL(req.url);
    const allParticipants = url.searchParams.get('all');
    let all: boolean = false;
    if (allParticipants === 'true') {
        all = true;
    }

    const from = url.searchParams.get('from'); // Get submissions from a certain Discord ID

    console.log(all);

    for (const submission of submissions) {
        submission.dataValues.upvotes = votes.filter(vote => vote.submissionId === submission.id && vote.value === 1).length;
        submission.dataValues.downvotes = votes.filter(vote => vote.submissionId === submission.id && vote.value === -1).length;

        if (await validateAuthHeaders(req)) {
            submission.dataValues.votes = votes.filter(vote => vote.submissionId === submission.id);
        }
    }

    if (!all) {
        submissions = submissions.filter(e => !e.prev);
    }

    if (from) {
        submissions = submissions.filter(e => e.suggestedBy === from);
    }

    const res = new Response(JSON.stringify(submissions), {status: 200, headers: {'Content-Type': 'application/json'}});
    res.headers.set('Access-Control-Allow-Origin', '*');

    return res;
}

/**
 * Get a single submission.
 * The id of the submission is expected to be passed as a query parameter.
 * @param req
 */
export async function getSubmission(req: Request): Promise<Response> {
    logger.debug("Parsing the request");
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
        return new Response('Bad request', {status: 400});
    }

    logger.debug("Getting the submission");
    const submission = await SubmissionEntry.findByPk(id);
    const votes = await SubmissionVote.findAll();

    if (!submission) {
        return new Response('Not found', {status: 404});
    }

    submission.dataValues.upvotes = votes.filter(vote => vote.submissionId === submission.id && vote.value === 1).length;
    submission.dataValues.downvotes = votes.filter(vote => vote.submissionId === submission.id && vote.value === -1).length;

    if (await validateAuthHeaders(req)) {
        submission.dataValues.votes = votes.filter(vote => vote.submissionId === submission.id);
    }

    return new Response(JSON.stringify(submission), {status: 200, headers: {'Content-Type': 'application/json'}});
}

/**
 * Get all votes for a submission.
 * @param req
 */
export async function getSubmissionVotes(req: Request): Promise<Response> {
    logger.debug("Validating auth headers");
    if (!await validateAuthHeaders(req)) {
        return new Response('Unauthorized', {status: 401});
    }

    logger.debug("Parsing the request");
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
        return new Response('Bad request', {status: 400});
    }

    logger.debug("Getting the votes");
    const votes = await SubmissionVote.findAll({
        where: {
            submissionId: id
        }
    });

    return new Response(JSON.stringify(votes), {status: 200, headers: {'Content-Type': 'application/json'}});
}