import { z } from 'zod'
import { Sub } from '~/@/pub-sub'
import { QueryInput } from './query-input/query-input'
import { QueryOutput } from './query-output/query-output'
import { UpsertInput } from './upsert-input/upsert-input'
import { UpsertOutput } from './upsert-output/upsert-output'

export type Parser<
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
> = {
  Entity: z.ZodType<TEntity>
  Related: z.ZodType<TRelated>
  QueryInput: z.ZodType<QueryInput<TEntity>>
  QueryOutput: z.ZodType<QueryOutput<TEntity, TRelated>>
  UpsertInput: z.ZodType<UpsertInput<TEntity>>
  UpsertOutput: z.ZodType<UpsertOutput<TEntity>>
}

export const parser = <
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
>(config: {
  Entity: z.ZodType<TEntity>
  Related: z.ZodType<TRelated>
}): Parser<TEntity, TRelated> => {
  return {
    Entity: config.Entity,
    Related: config.Related,
    // @ts-ignore
    QueryInput: QueryInput.parser(config.Entity),
    QueryOutput: QueryOutput.parser(config.Entity, config.Related),
    UpsertInput: UpsertInput.parser(config.Entity),
    UpsertOutput: UpsertOutput.parser(config.Entity),
  }
}

export type Infer<T> =
  T extends Parser<
    infer TEntity extends Record<string, unknown>,
    infer TRelated extends Record<string, unknown>
  >
    ? Db<TEntity, TRelated>
    : never

export type InferQueryInput<T> =
  T extends Parser<infer TEntity extends Record<string, unknown>, infer _TRelated>
    ? QueryInput<TEntity>
    : never

export type InferQueryOutput<T> =
  T extends Parser<infer TEntity, infer TRelated> ? QueryOutput<TEntity, TRelated> : never

export type InferUpsertInput<T> =
  T extends Parser<infer TEntity, infer _TRelated> ? UpsertInput<TEntity> : never

export type InferUpsertOutput<T> =
  T extends Parser<infer TEntity, infer _TRelated> ? UpsertOutput<TEntity> : never

export type Db<
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
> = {
  query: (query: QueryInput<TEntity>) => Promise<QueryOutput<TEntity, TRelated>>
  liveQuery: (query: QueryInput<TEntity>) => Sub<QueryOutput<TEntity, TRelated>>
  upsert: (input: UpsertInput<TEntity>) => Promise<UpsertOutput<TEntity>>
}
