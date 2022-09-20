/**
 * 创建一个去重后的array数组副本。只有第一次出现的元素才会被保留。
 * @param {Array} array  要检查的数组。
 * @returns {Array} 返回新的去重后的数组。
 * @example
 *
 * uniq([2, 1, 2])
 * // => [2, 1]
 */
function uniq(array) {
  return Array.from(new Set(array));
}

// console.log(uniq([2, 1, 2]));

export default uniq