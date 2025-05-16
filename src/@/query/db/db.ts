import { QueryInput } from "../query-input/query-input"
import { QueryOutput } from "../query-output/query-output"


export type Db<TEntity, TRelated> = {
    query: (query: QueryInput<TEntity>) => Promise<QueryOutput<TEntity, TRelated>>
    liveQuery: (query: QueryInput<TEntity>) => Promise<QueryOutput<TEntity, TRelated>>
    upsert: (item: TEntity) => Promise<TEntity>
}
