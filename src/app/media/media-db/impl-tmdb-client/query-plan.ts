export type QueryPlanItem =
  | {
      t: 'discover-movie'
    }
  | {
      t: 'movie-details'
      tmdbMovieId: number
    }

export type QueryPlan = {
  items: QueryPlanItem[]
}
