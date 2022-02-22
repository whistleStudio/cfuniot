let a = 1
setInterval(()=>{b(a)},1000)

function b (c) {
  console.log(c)
}

setTimeout(()=> {a =10},3000)