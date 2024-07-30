import dotenv from 'dotenv'
const deData = dotenv.config()
if (deData.error) {
  throw deData.error
}

import express from 'express'
import * as http from 'http'

import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import cors from 'cors'
import { CommonRoutesConfig } from './common/common.routes.config.ts'
import { SubmissionsRoutesConfig } from './submissions/submissions.routes.config.ts'
import { EventsRoutesConfig } from './events/events.routes.config.ts'
import { KeysRoutesConfig } from "./keys/keys.routes.config.ts";
import debug from 'debug'

const app: express.Application = express()
const server: http.Server = http.createServer(app)
const port = process.env.PORT || 3000
const routes: Array<CommonRoutesConfig> = []
const debugLog: debug.IDebugger = debug('app')

app.use(express.json())
app.use(express.static('public'))
app.use(cors())

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  )
}

if (!process.env.DEBUG) {
  loggerOptions.meta = false // when not debugging, make terse
}

app.use(expressWinston.logger(loggerOptions))

routes.push(new KeysRoutesConfig(app))
routes.push(new SubmissionsRoutesConfig(app))
routes.push(new EventsRoutesConfig(app))

const runningMessage = `Server running at http://localhost:${port}`
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage)
})

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`)
  })

  console.log(runningMessage)
})