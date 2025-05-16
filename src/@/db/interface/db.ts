import { z } from 'zod'
import { Sub } from '~/@/pub-sub'
import { QueryInput } from './query-input/query-input'
import { QueryOutput } from './query-output/query-output'
import { UpsertInput } from './upsert-input/upsert-input'
import { UpsertOutput } from './upsert-output/upsert-output'

export type Parser<TField, TEntity, TRelated> = {
  Field: z.ZodType<TField>
  Entity: z.ZodType<TEntity>
  Related: z.ZodType<TRelated>
  QueryInput: z.ZodType<QueryInput<TField>>
  QueryOutput: z.ZodType<QueryOutput<TEntity, TRelated>>
  UpsertInput: z.ZodType<UpsertInput<TEntity>>
  UpsertOutput: z.ZodType<UpsertOutput<TEntity>>
}

export const parser = <TField, TEntity, TRelated>(config: {
  Field: z.ZodType<TField>
  Entity: z.ZodType<TEntity>
  Related: z.ZodType<TRelated>
}): Parser<TField, TEntity, TRelated> => {
  return {
    Field: config.Field,
    Entity: config.Entity,
    Related: config.Related,
    QueryInput: QueryInput.parser(config.Field),
    QueryOutput: QueryOutput.parser(config.Entity, config.Related),
    UpsertInput: UpsertInput.parser(config.Entity),
    UpsertOutput: UpsertOutput.parser(config.Entity),
  }
}

export type Infer<T> =
  T extends Parser<infer TField, infer TEntity, infer TRelated>
    ? Db<TField, TEntity, TRelated>
    : never

export type InferQueryInput<T> =
  T extends Parser<infer TField, infer TEntity, infer TRelated> ? QueryInput<TField> : never

export type Db<TField, TEntity, TRelated> = {
  query: (query: QueryInput<TField>) => Promise<QueryOutput<TEntity, TRelated>>
  liveQuery: (query: QueryInput<TField>) => Sub<QueryOutput<TEntity, TRelated>>
  upsert: (input: UpsertInput<TEntity>) => Promise<UpsertOutput<TEntity>>
}
