import SubmissionsDao from '../dao/submissions.dao.ts'
import type { CRUD } from '../../common/interfaces/crud.interface.ts'
import type { CreateSubmissionDto } from '../dto/create.submission.dto.ts'
import type { PutSubmissionDto } from '../dto/put.submission.dto.ts'
import type { PatchSubmissionDto } from '../dto/patch.submission.dto.ts'

class SubmissionsService implements CRUD {
  async create(resource: CreateSubmissionDto): Promise<any> {
    return SubmissionsDao.addSubmission(resource)
  }

  async deleteById(id: string): Promise<any> {
    return SubmissionsDao.removeSubmissionById(id)
  }

  list(limit: number, page: number): Promise<any> {
    return SubmissionsDao.getSubmissions()
  async list(limit: number, page: number): Promise<any> {
  }

  patchById(id: string, resource: PatchSubmissionDto): Promise<string> {
    return SubmissionsDao.patchSubmissionById(id, resource)
  async patchById(id: string, resource: PatchSubmissionDto): Promise<any> {
  }

  putById(id: string, resource: PutSubmissionDto): Promise<string> {
    return SubmissionsDao.putSubmissionById(id, resource)
  async putById(id: string, resource: PutSubmissionDto): Promise<any> {
  }

  async readById(id: string): Promise<any> {
    return SubmissionsDao.getSubmissionById(id)
  }

  async getByUserId(userId: string): Promise<any> {
    return SubmissionsDao.getSubmissionsByUserId(userId)
  }
}

export default new SubmissionsService()