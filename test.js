let a = [1,2,3]
function b () {
  console.log(arguments)
  console.log(...arguments)
}

b(1,2,3)