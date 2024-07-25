import express from 'express'
import { CommonRoutesConfig } from '../common/common.routes.config.ts'

export class EventsRoutesConfig extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'EventsRoutes')
  }

  configureRoutes(): express.Application {
    return this.app; // TODO: this is a placeholder
  }
}