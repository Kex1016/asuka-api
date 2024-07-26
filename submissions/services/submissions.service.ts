import SubmissionsDao from '../dao/submissions.dao.ts'
import type { CRUD } from '../../common/interfaces/crud.interface.ts'
import type { CreateSubmissionDto } from '../dto/create.submission.dto.ts'
import type { PutSubmissionDto } from '../dto/put.submission.dto.ts'
import type { PatchSubmissionDto } from '../dto/patch.submission.dto.ts'

class SubmissionsService implements CRUD {
  create(resource: CreateSubmissionDto): Promise<any> {
    return SubmissionsDao.addSubmission(resource)
  }

  deleteById(id: string): Promise<string> {
    return SubmissionsDao.removeSubmissionById(id)
  }

  list(limit: number, page: number): Promise<any> {
    return SubmissionsDao.getSubmissions()
  }

  patchById(id: string, resource: PatchSubmissionDto): Promise<string> {
    return SubmissionsDao.patchSubmissionById(id, resource)
  }

  putById(id: string, resource: PutSubmissionDto): Promise<string> {
    return SubmissionsDao.putSubmissionById(id, resource)
  }

  readById(id: string): Promise<any> {
    return SubmissionsDao.getSubmissionById(id)
  }

  getByUserId(userId: string): Promise<any> {
    return SubmissionsDao.getSubmissionByUserId(userId)
  }
}

export default new SubmissionsService()