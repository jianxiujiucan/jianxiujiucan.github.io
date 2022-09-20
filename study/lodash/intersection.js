/**
 * 创建唯一值的数组，这个数组包含所有给定数组都包含的元素，使用SameValueZero进行相等性比较。（注：可以理解为给定数组的交集）
 * @param  {...Array} [arrays] 待检查的数组。
 * @returns {Array} 返回的数组
 * @example
 *
 * intersection([2, 1], [2, 3])
 * // => [2]
 */

function intersection(...arrays) {
  // const [a, b] = arrays;
  // return a.filter(item => b.indexOf(item) > -1);
  const [a, b] = arrays
  const s = new Set(b)
  const result = new Set(a.filter(item => s.has(item)))
  return [...result]
}

console.log(intersection([2, 1], [2, 3]));
