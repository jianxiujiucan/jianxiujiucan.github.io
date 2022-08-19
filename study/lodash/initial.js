/**
 * 获取数组array中除了最后一个元素之外的所有元素（注：去除数组array中的最后一个元素）。
 * @param {Array} array
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * initial([1, 2, 3])
 * // => [1, 2]
 */
 function initial(array){
  return array.slice(0, array.length - 1)
}

console.log(initial([1, 2, 3]))


