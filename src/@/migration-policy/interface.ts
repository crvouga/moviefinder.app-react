import { IDbConn } from '../db-conn/interface'

/**
 *
 */
export type IMigrationPolicy = {
  /**
   * Run the migration policy.
   *
   * @param input - The input to the migration policy.
   * @returns A promise that resolves to void.
   */
  run: (input: { dbConn: IDbConn; up: string; down: string }) => Promise<void>
}
