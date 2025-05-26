import { ILogger } from '~/@/logger'

export const SLOW_QUERY_THRESHOLD = 1

export const logSlowQuery = (input: {
  entityCount: number
  filteredCount: number
  logger: ILogger
  query: unknown
  startTime: number
  endTime: number
}) => {
  const duration = input.endTime - input.startTime
  if (duration > SLOW_QUERY_THRESHOLD) {
    input.logger.warn(
      `query took: ${duration.toFixed(2)} ms, total records: ${input.entityCount}; ${input.filteredCount} filtered`,
      input.query
    )
  }
}
