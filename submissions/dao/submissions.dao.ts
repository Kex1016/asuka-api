import { type CreateSubmissionDto } from '../dto/create.submission.dto.ts'
import { type PatchSubmissionDto } from '../dto/patch.submission.dto.ts'
import { type PutSubmissionDto } from '../dto/put.submission.dto.ts'

import { nanoid } from 'nanoid'
import debug from 'debug'

const log: debug.IDebugger = debug('app:submissions-dao')

class SubmissionsDao {
  submissions: Array<CreateSubmissionDto> = []

  constructor() {
    log('Created new instance of SubmissionsDao')
  }

  async addSubmission(submission: CreateSubmissionDto) {
    submission.id = nanoid() // TODO: Change the DB to have string IDs
    this.submissions.push(submission)
    return submission.id
  }

  async getSubmissions() {
    return this.submissions
  }

  async getSubmissionById(submissionId: string) {
    return this.submissions.find((submission: { id: string }) => submission.id === submissionId)
  }

  async putSubmissionById(submissionId: string, submission: PutSubmissionDto) {
    const objIndex = this.submissions.findIndex((obj: { id: string }) => obj.id === submissionId)
    this.submissions.splice(objIndex, 1, submission)
    return `${submission.id} updated via PUT`
  }

  async patchSubmissionById(submissionId: string, submission: PatchSubmissionDto) {
    const objIndex = this.submissions.findIndex((obj: { id: string }) => obj.id === submissionId)
    let currentSubmission = this.submissions[objIndex]
    const allowedPatchFields = [
      'name',
      'image',
      'messageId',
      'accepted',
      'used',
      'prev'
    ]
    for (let field of allowedPatchFields) {
      if (field in submission) {
        // @ts-ignore
        currentSubmission[field] = submission[field]
      }
    }
    this.submissions.splice(objIndex, 1, currentSubmission)
    return `${submission.id} patched`
  }

  async removeSubmissionById(submissionId: string) {
    const objIndex = this.submissions.findIndex((obj: { id: string }) => obj.id === submissionId)
    this.submissions.splice(objIndex, 1)
    return `${submissionId} removed`
  }

  async getSubmissionByUserId(suggestedBy: string) {
    return this.submissions.filter((submission: { suggestedBy: string }) => submission.suggestedBy === suggestedBy)
  }
}

export default new SubmissionsDao()