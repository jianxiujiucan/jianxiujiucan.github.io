/**
 * 减少一级array嵌套深度。
 * @param {Array} array 需要减少嵌套层级的数组。
 * @returns {Array} 返回减少嵌套层级后的新数组。
 * @example
 * flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  return array.flat()
}

console.log(flatten([1, [2, [3, [4]], 5]]))