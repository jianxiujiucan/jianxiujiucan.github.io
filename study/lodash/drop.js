/**
 * 创建一个切片数组，去除array前面的n个元素。（n默认值为1。）
 * @param {Array} array 要查询的数组。
 * @param {Number} n 要去除的元素个数。
 * @example 
 * 
 * drop([1, 2, 3])
 * // => [2, 3]
 *
 * drop([1, 2, 3], 2)
 * // => [3]
 *
 * drop([1, 2, 3], 5)
 * // => []
 *
 * drop([1, 2, 3], 0)
 * // => [1, 2, 3]
 */
function drop(array, n = 1) {
  const length = array.length
  return array.slice(n, length)
}

console.log(drop([1, 2, 3]))
console.log(drop([1, 2, 3], 2))
console.log(drop([1, 2, 3], 5))
console.log(drop([1, 2, 3], 0))