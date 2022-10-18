let string = 'aaabaaaaaaa caaaaadefg'

console.log(string.slice(0,2))
console.log(string.slice(-2))
console.log(string.slice(1,3))

let array = ['ant', 'bison', 'camel', 'duck', 'elephant'];
console.log(array.slice(0,2), array)
array.splice(1, 2, 'de')
console.log(array)
