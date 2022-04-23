export { }

/*
  151 - Query String Parser
  -------
  by Pig Fang (@g-plane) #extreme #template-literal

  ### Question

  You're required to implement a type-level parser to parse URL query string into a object literal type.

  Some detailed requirements:

  - Value of a key in query string can be ignored but still be parsed to `true`. For example, `'key'` is without value, so the parser result is `{ key: true }`.
  - Duplicated keys must be merged into one. If there are different values with the same key, values must be merged into a tuple type.
  - When a key has only one value, that value can't be wrapped into a tuple type.
  - If values with the same key appear more than once, it must be treated as once. For example, `key=value&key=value` must be treated as `key=value` only.

  > View on GitHub: https://tsch.js.org/151
*/

/* _____________ Your Code Here _____________ */
// 合并两个接口
type MergeObj<S extends object, T extends object> = {
  [K in keyof T | keyof S]: K extends keyof S
  ? K extends keyof T
  ? S[K] extends any[]
  ? T[K] extends any[]
  ? [...S[K], ...T[K]]
  : [...S[K], T[K]]
  : S[K] extends T[K]
  ? S[K]
  :S[K] extends boolean
  ? T[K] extends boolean
  ? S[K] : [S[K], T[K]] : [S[K], T[K]]
  : S[K]
  : K extends keyof T ? T[K] : never
}

type SplitQuery<T extends string, Result extends object = {}> =
  T extends ''
  ? Result
  : T extends `${infer P}&${infer Rest}`
  ? P extends `${infer K}=${infer V}`
  ? MergeObj<{ [k in K]: V }, SplitQuery<Rest, Result>>
  : MergeObj<{ [k in P]: true }, SplitQuery<Rest, Result>>
  : T extends `${infer K}=${infer V}`
  ? { [k in K]: V }
  : { [k in T]: true }

type ParseQueryString<T extends string> = T extends '' ? {} : SplitQuery<T>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type R = ParseQueryString<'k1=v1&k2=v2&k1=v2'>

type cases = [
  Expect<Equal<ParseQueryString<''>, {}>>,
  Expect<Equal<ParseQueryString<'k1'>, { k1: true }>>,
  Expect<Equal<ParseQueryString<'k1&k1'>, { k1: true }>>,
  Expect<Equal<ParseQueryString<'k1&k2'>, { k1: true; k2: true }>>,
  Expect<Equal<ParseQueryString<'k1=v1'>, { k1: 'v1' }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k1=v2'>, { k1: ['v1', 'v2'] }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k2=v2'>, { k1: 'v1'; k2: 'v2' }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k2=v2&k1=v2'>, { k1: ['v1', 'v2']; k2: 'v2' }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k2'>, { k1: 'v1'; k2: true }>>,
  Expect<Equal<ParseQueryString<'k1=v1&k1=v1'>, { k1: 'v1' }>>,
]

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/151/answer
  > View solutions: https://tsch.js.org/151/solutions
  > More Challenges: https://tsch.js.org
*/
