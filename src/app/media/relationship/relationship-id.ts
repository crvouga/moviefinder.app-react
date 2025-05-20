import { z } from 'zod'
import { RelationshipType } from './relationship-type'
import { MediaId } from '../media/media-id'

const parser = z.string()

export type RelationshipId = z.infer<typeof parser>

const init = (input: {
  fromId: MediaId
  toId: MediaId
  type: RelationshipType
}): RelationshipId => {
  return RelationshipId.parser.parse(
    `relationship:${input.type}-from:${input.fromId}-to:${input.toId}`
  )
}

const fromString = (id: string): RelationshipId => {
  return RelationshipId.parser.parse(id)
}

export const RelationshipId = {
  parser,
  init,
  fromString,
}
