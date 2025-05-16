import { z } from "zod"
import { Db } from "~/@/query/db/db"
import { QueryInput } from "~/@/query/query-input/query-input"
import { QueryOutput } from "~/@/query/query-output/query-output"
import { Person } from "../person"

export const PersonColumn = z.enum(['id', 'name', 'popularity'])
export type PersonColumn = z.infer<typeof PersonColumn>

export const PersonDbQueryInput = QueryInput.parser(PersonColumn)
export type PersonDbQueryInput = z.infer<typeof PersonDbQueryInput>

export const PersonDbQueryOutput = QueryOutput.parser(Person.parser, z.object({}))
export type PersonDbQueryOutput = z.infer<typeof PersonDbQueryOutput>

export type PersonDb = Db<Person, {}>