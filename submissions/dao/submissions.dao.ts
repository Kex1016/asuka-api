import mongooseService from "../../common/services/mongoose.service.ts";

import {type CreateSubmissionDto} from '../dto/create.submission.dto.ts'
import {type PatchSubmissionDto} from '../dto/patch.submission.dto.ts'
import {type PutSubmissionDto} from '../dto/put.submission.dto.ts'

import {nanoid} from 'nanoid'
import debug from 'debug'

const log: debug.IDebugger = debug('app:submissions-dao')

class SubmissionsDao {
    Schema = mongooseService.getMongoose().Schema;
    submissionSchema = new this.Schema({
        _id: String,
        name: String,
        image: String,
        suggestedBy: String,
        messageId: String,
        accepted: Boolean,
        used: Boolean,
        won: Boolean,
        addedAt: Date
    }, {id: false});

    Submission = mongooseService.getMongoose().model('Submissions', this.submissionSchema);

    submissions: Array<CreateSubmissionDto> = []

    constructor() {
        log('Created new instance of SubmissionsDao')
    }

    async addSubmission(submissionFields: CreateSubmissionDto) {
        const submissionId = nanoid()
        const submission = new this.Submission({
            _id: submissionId,
            ...submissionFields
        });

        // TODO: Add downloading image to local storage

        await submission.save()
        return submissionId
    }

    async getSubmissions(limit = 25, page = 0) {
        return this.Submission.find()
            .limit(limit)
            .skip(limit * page)
            .exec()
    }

    async getSubmissionById(submissionId: string) {
        return this.Submission.findById(submissionId).exec()
    }

    async getSubmissionsByUserId(suggestedBy: string) {
        return this.Submission.find({suggestedBy: suggestedBy}).exec()
    }

    async updateSubmissionById(submissionId: string, submissionFields: PatchSubmissionDto | PutSubmissionDto) {
        return await this.Submission.findOneAndUpdate(
            {_id: submissionId},
            {$set: submissionFields},
            {new: true}
        ).exec()
    }

    async removeSubmissionById(submissionId: string) {
        return this.Submission.deleteOne({_id: submissionId}).exec()
    }
}

export default new SubmissionsDao()