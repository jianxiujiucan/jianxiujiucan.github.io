/**
 * 使用 value 值来填充（替换） array，从start位置开始, 到end位置结束（但不包含end位置）。
 * 注: 这个方法会改变 array（注：不是创建新数组）。
 * @param {Array} array 要填充改变的数组。
 * @param {*} value 填充给 array 的值。
 * @param {number} [start=0] 开始位置（默认0）。
 * @param {number} [end=array.length] (number):结束位置（默认array.length）。
 * @returns {Array} 返回 `array`.
 * @example
 *
 * var array = [1, 2, 3];
 *
 * fill(array, 'a');
 * console.log(array);
 * // => ['a', 'a', 'a']
 *
 * fill(Array(3), 2);
 * // => [2, 2, 2]
 *
 * fill([4, 6, 8, 10], '*', 1, 3);
 * // => [4, '*', '*', 10]
 */
function fill(array, value, start = 0, end) {
  const length = array.length
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = length > end ? end : length
  for (let i = start; i < end; i++) {
    array[i] = value
  }

  return array
}
let array = [1, 2, 3];
console.log(fill(array, 'a'))
console.log(fill(Array(3), 2))
console.log(fill([4, 6, 8, 10], '*', 1, 3))