/**
 * 获取array数组的第n个元素。如果n为负数，则返回从数组结尾开始的第n个元素。
 *
 * @since 4.11.0
 * @category Array
 * @param {Array} array 要查询的数组。
 * @param {number} [n=0] T要返回元素的索引值。
 * @returns {*} 获取array数组的第n个元素
 * @example
 *
 * const array = ['a', 'b', 'c', 'd']
 *
 * nth(array, 1)
 * // => 'b'
 *
 * nth(array, -2)
 * // => 'c'
 */
function nth(array, n = 0){
  return array.splice(1, n)
}

const array = ['a', 'b', 'c', 'd']
console.log(nth(array, 1))
console.log(nth(array, -2));
