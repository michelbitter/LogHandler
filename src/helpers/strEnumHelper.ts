/**
 *  NOTE:
 *    https://basarat.gitbooks.io/typescript/docs/types/literal-types.html
 *    Utility function to create a K:V from a list of strings
 */

// tslint:disable-next-line:prefer-array-literal
export function strEnumHelper<T extends string>(o: Array<T>): {[K in T]: K} {
  return o.reduce((res, key) => {
    res[key] = key
    return res
  }, Object.create(null))
}
