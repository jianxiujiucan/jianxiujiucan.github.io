/**
 * 根据 depth 递归减少 array 的嵌套层级
 * @param {Array} array 需要减少嵌套层级的数组。
 * @param {Number} depth 最多减少的嵌套层级数。
 * @returns {Array} 返回减少嵌套层级后的新数组。
 * @example
 * 
 * const array = [1, [2, [3, [4]], 5]]
 *
 * flattenDepth(array, 1)
 * // => [1, 2, [3, [4]], 5]
 *
 * flattenDepth(array, 2)
 * // => [1, 2, 3, [4], 5]
 */
function flattenDepth(array, depth = 1){
  return array.flat(depth)
}

const array = [1, [2, [3, [4]], 5]]
console.log(flattenDepth(array, 1))
console.log( flattenDepth(array, 2))