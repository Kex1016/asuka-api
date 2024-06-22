#!/usr/bin/env -S bun run

import "dotenv/config";

import Bun from 'bun';
import logger from "./util/logger.ts";
import {getAllSubmissions, getSubmission, getSubmissionVotes} from "./routes/get/submission.ts";
import {postSubmission, postSubmissionVote} from "./routes/post/submission.ts";
import {patchSubmission, patchSubmissionVote} from "./routes/patch/submission.ts";
import {deleteSubmission, deleteSubmissionVote} from "./routes/delete/submission.ts";
import {patchEvent} from "./routes/patch/events.ts";
import {deleteEvent, deleteEventParticipant} from "./routes/delete/events.ts";
import {postEvent, postEventParticipant} from "./routes/post/events.ts";
import {getAllEvents, getEvent, getEventParticipant, getEventParticipants} from "./routes/get/events.ts";

const basePath = '/api';

const server = Bun.serve({
    port: process.env.PORT || 8080,
    async fetch(request: Request) {
        const url = new URL(request.url);
        const method = request.method;

        logger.info(`${request.headers.get('User-Agent')} ${method} ${url.pathname}`);

        // Public paths
        const imagesRE = /^\/images\//;

        // Submissions
        const submissionRE = /^\/api\/submission$/;             // GET, POST, PATCH, DELETE a submission
        const allSubmissionsRE = /^\/api\/submission\/all$/;    // GET all submissions
        const submissionVotesRE = /^\/api\/submission\/votes$/; // GET all votes for a submission
        const submissionVoteRE = /^\/api\/submission\/vote$/;   // POST or DELETE a vote

        // Events
        const eventRE = /^\/api\/event$/;                           // GET, POST, PATCH, DELETE an event
        const allEventsRE = /^\/api\/event\/all$/;                  // GET all events
        const eventParticipantsRE = /^\/api\/event\/participants$/; // GET all participants for an event
        const eventParticipantRE = /^\/api\/event\/participant$/;   // POST, DELETE a participant

        // Exchanges
        // TODO: Add exchanges

        if (url.pathname === "/") {
            // Serve a page for all the endpoints
            return new Response(`
                <html lang="en">
                    <head>
                        <title>Asuka API</title>
                    </head>
                    <body>
                        <h1>Asuka API</h1>
                        <p>
                            You aren't really supposed to be here. This is the API for Asuka for Gakkou Culture Club.
                        </p>
                        <h2>Submissions</h2>
                        <ul>
                            <li><a href="${basePath}/submission">GET, POST, PATCH or DELETE a submission</a></li>
                            <li><a href="${basePath}/submission/all">GET all submissions</a></li>
                            <li><a href="${basePath}/submission/votes">GET all votes for a submission</a></li>
                            <li><a href="${basePath}/submission/vote">POST, DELETE or PATCH a vote</a></li>
                        </ul>
                        <h2>Events</h2>
                        <ul>
                            <li><a href="${basePath}/event">GET, POST, PATCH or DELETE an event</a></li>
                            <li><a href="${basePath}/event/all">GET all events</a></li>
                            <li><a href="${basePath}/event/participants">GET all participants for an event</a></li>
                            <li><a href="${basePath}/event/participant">POST or DELETE a participant</a></li>
                        </ul>
                        <p>
                            <b>NOTE:</b> Any method other than GET will need an <code>Authorization</code> header with the API key.
                        </p>
                        <p>
                            <b>IMAGES:</b> All images are served from the /images/ directory.
                        </p>
                        <p>
                            <b>METHODS:</b> Any link you see here is automatically going to use GET if you open it in your browser.
                        </p>
                    </body>
                </html>
            `, {headers: {'Content-Type': 'text/html'}});
        }

        if (method === 'GET') {
            if (url.pathname.match(imagesRE)) {
                logger.info(`Serving image ${url.pathname}`);
                const file = Bun.file("./public/images/" + url.pathname.split('/').pop());
                if (!file || !await file.exists()) {
                    return new Response('Not found', {status: 404});
                }
                return new Response(file);
            }

            if (url.pathname.match(allSubmissionsRE)) {
                return await getAllSubmissions(request);
            }

            if (url.pathname.match(submissionRE)) {
                return await getSubmission(request);
            }

            if (url.pathname.match(submissionVotesRE)) {
                return await getSubmissionVotes(request);
            }

            if (url.pathname.match(eventRE)) {
                return await getEvent(request);
            }

            if (url.pathname.match(allEventsRE)) {
                return await getAllEvents(request);
            }

            if (url.pathname.match(eventParticipantsRE)) {
                return await getEventParticipants(request);
            }

            if (url.pathname.match(eventParticipantRE)) {
                return await getEventParticipant(request);
            }
        }

        if (method === 'POST') {
            if (url.pathname.match(submissionRE)) {
                return await postSubmission(request);
            }

            if (url.pathname.match(submissionVoteRE)) {
                return await postSubmissionVote(request);
            }

            if (url.pathname.match(eventRE)) {
                return await postEvent(request);
            }

            if (url.pathname.match(eventParticipantRE)) {
                return await postEventParticipant(request);
            }
        }

        if (method === 'PATCH') {
            if (url.pathname.match(submissionRE)) {
                return await patchSubmission(request);
            }

            if (url.pathname.match(submissionVoteRE)) {
                return await patchSubmissionVote(request);
            }

            if (url.pathname.match(eventRE)) {
                return await patchEvent(request);
            }
        }

        if (method === 'DELETE') {
            if (url.pathname.match(submissionRE)) {
                return await deleteSubmission(request);
            }

            if (url.pathname.match(submissionVoteRE)) {
                return await deleteSubmissionVote(request);
            }

            if (url.pathname.match(eventRE)) {
                return await deleteEvent(request);
            }

            if (url.pathname.match(eventParticipantRE)) {
                return await deleteEventParticipant(request);
            }
        }

        return new Response('Not found', {status: 404});
    }
});

console.log(`Server is running at ${server.url}`);