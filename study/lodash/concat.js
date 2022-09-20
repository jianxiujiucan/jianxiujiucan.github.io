/**
 * 创建一个新数组，将array与任何数组 或 值连接在一起。
 * @param {array} array 被连接的数组。
 * @param  {...any} values 连接的值。
 * @returns {array} 返回连接后的新数组。
 * @example 
 * 
 * const array = [1]; 
 * const other = _.concat(array, 2, [3], [[4]]); 
 * 
 * console.log(other);
 * // => [1, 2, 3, [4]] 
 */
function concat(array, ...values){
  let newArray = array
  values = values.flat()
  for(let i of values){
    newArray.push(i)
  }
  return  newArray
}

const arr1 = [1]
// console.log(concat(arr1, 2, [3], [[4]]))

export default concat