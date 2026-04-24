import { logger } from 'logger'
import { app } from './app'

app.listen(3333)

logger.info(
  `HTTP server running at http://${app.server?.hostname}:${app.server?.port}`
)

;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}