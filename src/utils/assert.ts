/** Fail throwing an error if the condition is falsy */
export function assert(condition: unknown, message: string): asserts condition {
  if (condition) return

  // coverage ignore next
  throw new Error(message)
}
