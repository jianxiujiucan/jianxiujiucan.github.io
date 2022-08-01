/**
 * 创建一个切片数组，去除array尾部的n个元素。（n默认值为1。）
 * @param {Array} array 要查询的数组。
 * @param {Number} n  要去除的元素个数。
 * @example
 *
 * dropRight([1, 2, 3])
 * // => [1, 2]
 *
 * dropRight([1, 2, 3], 2)
 * // => [1]
 *
 * dropRight([1, 2, 3], 5)
 * // => []
 *
 * dropRight([1, 2, 3], 0)
 * // => [1, 2, 3]
 */
function dropRight(array, n = 1) {
  const end = array.length - n > 0 ? array.length - n  : 0
  return array.slice(0, end)
}

console.log(dropRight([1, 2, 3]))
console.log(dropRight([1, 2, 3], 2))
console.log(dropRight([1, 2, 3], 5))
console.log(dropRight([1, 2, 3], 0))