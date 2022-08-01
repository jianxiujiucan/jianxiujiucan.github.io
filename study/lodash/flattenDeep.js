/**
 * 将array递归为一维数组
 * @param {Array} array 需要处理的数组。
 * @returns 返回一个的新一维数组。
 * @example
 * flattenDeep([1, [2, [3, [4]], 5]]);
 * // => [1, 2, 3, 4, 5]
 */
function flattenDeep(array) {
  const newArr = [];

  for (let i = 0; i < array.length; i++) {
    if (Array.isArray(array[i])) {
      newArr.push(...flattenDeep(array[i]));
    } else {
      newArr.push(array[i]);
    }
  }

  return newArr;
}

console.log(flattenDeep([1, [2, [3, [4]], 5]]));
