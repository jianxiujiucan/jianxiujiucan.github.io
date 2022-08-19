/**
 * 创建一个数组切片，从array数组的最后一个元素开始提取n个元素。
 * @param {Array} array 要检索的数组。
 * @param {number} [n=1] T要提取的元素个数。
 * @returns {Array}  数组的切片（从结尾元素开始n个元素）。
 * @example
 *
 * takeRight([1, 2, 3])
 * // => [3]
 *
 * takeRight([1, 2, 3], 2)
 * // => [2, 3]
 *
 * takeRight([1, 2, 3], 5)
 * // => [1, 2, 3]
 *
 * takeRight([1, 2, 3], 0)
 * // => []
 */
function takeRight(array, n = 1) {
  let start = array.length > n ? array.length - n : 0
  return array.slice( start, array.length)
}
// console.log(takeRight([1, 2, 3]))
// console.log(takeRight([1, 2, 3], 2))
// console.log(takeRight([1, 2, 3], 5))
// console.log(takeRight([1, 2, 3], 0));
export default takeRight
