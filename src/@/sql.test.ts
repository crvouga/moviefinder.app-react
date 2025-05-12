import { describe, expect, it } from 'bun:test'
import { sql } from './sql'

describe.skip('sql', () => {
  it('should generate SQL with parameters', () => {
    const result = sql`SELECT * FROM users WHERE id = ${1} AND name = ${'John'}`
    expect(result.rawSql).toBe('SELECT * FROM users WHERE id = $1 AND name = $2')
    expect(result.params).toEqual([1, 'John'])
  })

  it('should handle empty parameters', () => {
    const result = sql`SELECT * FROM users`
    expect(result.rawSql).toBe('SELECT * FROM users')
    expect(result.params).toEqual([])
  })

  it('should handle multiple parameters in sequence', () => {
    const result = sql`INSERT INTO users (id, name, age) VALUES (${1}, ${'John'}, ${25})`
    expect(result.rawSql).toBe('INSERT INTO users (id, name, age) VALUES ($1, $2, $3)')
    expect(result.params).toEqual([1, 'John', 25])
  })

  it('should handle parameters with special characters', () => {
    const result = sql`SELECT * FROM users WHERE name LIKE ${'%John%'}`
    expect(result.rawSql).toBe('SELECT * FROM users WHERE name LIKE $1')
    expect(result.params).toEqual(['%John%'])
  })

  it('should handle nested queries', () => {
    const subQuery = sql`SELECT id FROM roles WHERE name = ${'admin'}`
    const result = sql`SELECT * FROM users WHERE role_id IN (${subQuery})`
    expect(result.rawSql).toBe(
      'SELECT * FROM users WHERE role_id IN (SELECT id FROM roles WHERE name = $1)'
    )
    expect(result.params).toEqual(['admin'])
  })

  it('should handle bulk insertions', () => {
    const values = [
      { id: 1, name: 'John', age: 25 },
      { id: 2, name: 'Jane', age: 30 },
      { id: 3, name: 'Bob', age: 35 },
    ].map((row) => [row.id, row.name, row.age])
    const result = sql`INSERT INTO users (id, name, age) VALUES ${values}`
    expect(result.rawSql).toBe(
      `INSERT INTO users (id, name, age) VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)`.trim()
    )
    expect(result.params).toEqual([1, 'John', 25, 2, 'Jane', 30, 3, 'Bob', 35])
  })
  it('should handle complex nested queries with multiple parameters', () => {
    const subQuery1 = sql`SELECT id FROM departments WHERE name = ${'IT'}`
    const subQuery2 = sql`SELECT role_id FROM roles WHERE department_id IN (${subQuery1})`
    const result = sql`SELECT * FROM users WHERE role_id IN (${subQuery2}) AND status = ${'active'}`
    expect(result.rawSql).toBe(
      'SELECT * FROM users WHERE role_id IN (SELECT role_id FROM roles WHERE department_id IN (SELECT id FROM departments WHERE name = $1)) AND status = $2'
    )
    expect(result.params).toEqual(['IT', 'active'])
  })
})
