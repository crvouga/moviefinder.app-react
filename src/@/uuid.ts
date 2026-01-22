/**
 * Generate a UUID with fallback for environments where crypto.randomUUID is not available
 */
export const randomUUID = (): string => {
  // Try to use crypto.randomUUID if available (modern browsers, Node.js 16.7+, Bun)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback: Generate a UUID v4 manually
  // This works in all environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
