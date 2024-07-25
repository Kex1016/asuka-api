import express from 'express'
import { CommonRoutesConfig } from '../common/common.routes.config.ts'

export class SubmissionsRoutesConfig extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'SubmissionsRoutes')
  }

  configureRoutes(): express.Application {
    this.app.route(`/submissions`)
      .get((req: express.Request, res: express.Response) => {
        res.status(200).send(`List of submissions`)
      })
      .post((req: express.Request, res: express.Response) => {
        res.status(200).send(`Post to submissions`)
      })

    this.app.route(`/submissions/:submissionId`)
      .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
        next()
      })
      .get((req: express.Request, res: express.Response) => {
        res.status(200).send(`GET requested for id ${req.params.submissionId}`)
      })
      .put((req: express.Request, res: express.Response) => {
        res.status(200).send(`PUT requested for id ${req.params.submissionId}`)
      })
      .patch((req: express.Request, res: express.Response) => {
        res.status(200).send(`PATCH requested for id ${req.params.submissionId}`)
      })
      .delete((req: express.Request, res: express.Response) => {
        res.status(200).send(`DELETE requested for id ${req.params.submissionId}`)
      })

    return this.app
  }
}