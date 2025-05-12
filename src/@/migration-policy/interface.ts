import { IDbConn } from '../db-conn/interface'

export type IMigrationPolicy = {
  run: (input: { dbConn: IDbConn; key: string; up: string; down: string }) => Promise<void>
}
