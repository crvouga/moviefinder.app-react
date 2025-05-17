import { describe, expect, it } from 'bun:test'
import { compileSql } from './compile'

describe('compileSql', () => {
  it('should replace ? with params', () => {
    const sql = 'SELECT * FROM users WHERE id = ? AND name = ?'
    const params = [1, 'John']
    const result = compileSql(sql, params)
    expect(result).toBe("SELECT * FROM users WHERE id = 1 AND name = 'John'")
  })

  it('should handle undefined params', () => {
    const sql = 'SELECT * FROM users WHERE id = ?'
    const result = compileSql(sql, undefined)
    expect(result).toBe('SELECT * FROM users WHERE id = ?')
  })

  it('should handle missing params', () => {
    const sql = 'SELECT * FROM users WHERE id = ? AND name = ?'
    const params = [1]
    const result = compileSql(sql, params)
    expect(result).toBe('SELECT * FROM users WHERE id = 1 AND name = ?')
  })

  it('should handle empty params array', () => {
    const sql = 'SELECT * FROM users WHERE id = ?'
    const params: any[] = []
    const result = compileSql(sql, params)
    expect(result).toBe('SELECT * FROM users WHERE id = ?')
  })

  it('should handle different param types', () => {
    const sql = 'SELECT * FROM users WHERE id = ? AND active = ? AND score = ?'
    const params = [1, true, 3.14]
    const result = compileSql(sql, params)
    expect(result).toBe('SELECT * FROM users WHERE id = 1 AND active = true AND score = 3.14')
  })
})
