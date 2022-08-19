/**
 * 返回一个由键值对pairs构成的对象。
 * @param {Array} 键值对pairs。
 * @returns  {Object} 返回一个新对象。
 * @example
 *
 * fromPairs([['a', 1], ['b', 2]]);
 * // => { 'a': 1, 'b': 2 }
 */
 function fromPairs(pairs){
  let result = {}
  for(let i = 0; i< pairs.length;i++){
    result[pairs[i][0]] = pairs[i][1]
  }
  return result
}

console.log(fromPairs([['a', 1], ['b', 2]]))