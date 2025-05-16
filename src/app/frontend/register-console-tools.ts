import { Ctx } from './ctx'
import { Psql } from './psql'

export const registerConsoleTools = (config: { ctx: Ctx }) => {
  const psql = Psql(config)
  // @ts-ignore
  window.q = psql.psql
  // @ts-ignore
  window.ctx = config.ctx
  // @ts-ignore
  window.c = () => console.clear()
}
