/**
 * 创建一个按顺序排列的唯一值的数组。所有给定数组的元素值使用SameValueZero做等值比较。（注： arrays（数组）的并集，按顺序返回，返回数组的元素是唯一的）
 *
 * @param {...Array} [arrays] 要检查的数组。
 * @returns {Array} 返回一个新的联合数组。
 * @example
 *
 * union([2, 3], [1, 2])
 * // => [2, 3, 1]
 */
function union(...arrays) {
  const [a, b] = arrays;
  // const result = a.concat(b.filter((item) => !a.includes(item)));
  return Array.from(new Set([...a,...b]));
}

console.log(union([2, 3], [1, 2]));

//export default union;
