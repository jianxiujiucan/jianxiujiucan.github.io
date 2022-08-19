/**
 * 获取除了array数组第一个元素以外的全部元素。
 *
 * @param {Array} array 要检索的数组。
 * @returns {Array} 返回 array 数组的切片（除了array数组第一个元素以外的全部元素）
 * @example
 *
 * tail([1, 2, 3])
 * // => [2, 3]
 */
function tail(array) {
  array.splice(0, 1)
  return array
}

// console.log(tail([1, 2, 3]))
export default tail
