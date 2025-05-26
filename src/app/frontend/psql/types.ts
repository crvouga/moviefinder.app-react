export type Command = {
  description: string
  match: RegExp
  handler: (strings: TemplateStringsArray, ...values: any[]) => Promise<void>
}
