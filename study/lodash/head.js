/**
 * 获取数组 array 的第一个元素。
 * @param {Array} array 要查询的数组。
 * @returns {*} 返回数组 array的第一个元素。
 * @example
 *
 * head([1, 2, 3])
 * // => 1
 *
 * head([])
 * // => undefined
 */
 function head(array) {
  return array.length > 0 ? array[0] : undefined;
}

console.log(head([1, 2, 3]));
console.log(head([]));