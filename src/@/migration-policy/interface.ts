import { ISqlDb } from '../sql-db/interface'

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
  run: (input: { sqlDb: ISqlDb; up: string[]; down: string[] }) => Promise<void>
}
