let arr = Array()
for (let i in Array(2).fill(0)) {
  console.log('-')
  arr.push([0,0])
}
arr[0][0] = 1
console.log(arr)
// console.log(Array(4))