/**
 * 获取array中的最后一个元素。
 * @param {Array} 要检索的数组。
 * @returns {*} 返回array中的最后一个元素。
 * @example
 *
 * last([1, 2, 3])
 * // => 3
 *
 * last([])
 * // => undefined
 */

function last(array) {
  return array.length > 0 ? array[array.length - 1] : undefined;
}

console.log(last([1, 2, 3]));
console.log(last([]));
