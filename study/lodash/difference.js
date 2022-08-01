/**
 * 创建一个具有唯一array值的数组，每个值不包含在其他给定的数组中。
 * 注：即创建一个新数组，这个数组中的值，为第一个数字（array 参数）排除了给定数组中的值。）
 * 该方法使用SameValueZero(http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)做相等比较。结果值的顺序是由第一个数组中的顺序确定。
 * @param {Array} array 要检查的数组。
 * @param {...Array} values 排除的值。
 * @returns {Array} 返回一个过滤值后的新数组。
 * @example 
 * 
 * difference([3, 2, 1], [4, 2]);
 * // => [3, 1]
 */
function difference(array, ...values) {
  // const set = new Set(...values);
  // return array.filter(item => !set.has(item));
  const v = values.flat();
  return array.filter((item) => !v.includes(item));
}

console.log(difference([2, 1], [2, 3]));
console.log(difference([3, 2, 1], [4, 2]));
console.log(difference([3, 2, 1, 5, 6], [4, 2, 5, 2]));
