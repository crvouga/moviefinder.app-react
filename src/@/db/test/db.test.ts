import { describe, expect, it } from 'bun:test'
import { KvDbFixture } from '~/@/kv-db/test/fixture'
import { Logger } from '~/@/logger'
import { unwrap } from '~/@/result'
import { ascend } from '~/@/sort'
import { SqlDbFixture } from '~/@/sql-db/test/fixture'
import { InferQueryInput } from '../interface/db'
import { Todo } from './todo'
import { TodoDb } from './todo-db/impl-sql'
import { ITodoDb } from './todo-db/interface'

const Fixture = async () => {
  const { sqlDb } = await SqlDbFixture()
  const { kvDb } = await KvDbFixture()
  const logger = Logger({ t: 'noop' })
  const todoDb = TodoDb({
    t: 'sql-db',
    sqlDb,
    logger,
    kvDb,
  })

  return {
    todoDb,
  }
}

describe('Db', () => {
  it('should work', async () => {
    const f = await Fixture()
    const todo = await Todo.random()
    const before = await f.todoDb.query({
      where: { op: '=', column: 'id', value: todo.id },
      orderBy: [],
      limit: 1,
      offset: 0,
    })
    const upserted = await f.todoDb.upsert({
      entities: [todo],
    })
    const after = await f.todoDb.query({
      where: { op: '=', column: 'id', value: todo.id },
      orderBy: [],
      limit: 1,
      offset: 0,
    })
    expect(unwrap(before).entities.items).toEqual([])
    expect(unwrap(upserted).entities).toEqual([todo])
    expect(unwrap(after).entities.items).toEqual([todo])
  })

  it.skip('should paginate', async () => {
    const f = await Fixture()
    const todos: Todo[] = []
    for (let i = 0; i < 10; i++) {
      const todo = await Todo.random()
      todos.push(todo)
    }
    todos.sort(ascend((t) => t.title))
    unwrap(await f.todoDb.upsert({ entities: todos }))
    const ids = todos.map((t) => t.id)
    const q: InferQueryInput<typeof ITodoDb.parser> = {
      where: { op: 'in', column: 'id', value: ids },
      orderBy: [{ column: 'createdAt', direction: 'asc' }],
      limit: 3,
      offset: 0,
    }
    const page1 = await f.todoDb.query({ ...q, offset: 0 })
    const page2 = await f.todoDb.query({ ...q, offset: 3 })
    const page3 = await f.todoDb.query({ ...q, offset: 6 })
    const page4 = await f.todoDb.query({ ...q, offset: 9 })
    expect(unwrap(page1).entities.items).toEqual(todos.slice(0, 3))
    expect(unwrap(page2).entities.items).toEqual(todos.slice(3, 6))
    expect(unwrap(page3).entities.items).toEqual(todos.slice(6, 9))
    expect(unwrap(page4).entities.items).toEqual(todos.slice(9, 10))
  })
})
