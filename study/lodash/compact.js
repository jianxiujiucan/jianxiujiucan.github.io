/**
 * 创建一个新数组，包含原数组中所有的非假值元素。
 * 例如false, null,0, "", undefined, 和 NaN 都是被认为是“假值”。
 * @param {Array} array 待处理的数组
 * @returns {Array} 返回过滤掉假值的新数组。
 * @example 
 * 
 * compact([0, 1, false, 2, '', 3]);
 * // => [1, 2, 3]
 */

function compact(array) {
  return array.filter(Boolean)
}

// console.log(compact([0, 1, false, 2, '', 3]))

export default compact