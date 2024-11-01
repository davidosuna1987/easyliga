export {}

declare global {
  interface Array<T> {
    joinReplaceLast(separator: string, lastSeparator?: string): string
  }
}
