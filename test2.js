let str = "阿克苏地区"
let reg = /(.+)(市|县|盟|州|地区)/
// console.log(str.match(reg))
if (str.length > 2) {
  if (reg.test(str)) {
    console.log(str.match(reg))
    str = str.match(reg)[1]
  }
}

let str2 = "宁夏回族自治区"
let reg2 = /(.+)省/
if (reg2.test(str2)) {
  str2 = str2.match(reg2)[1]
} else {
  str2 = str2.slice(0,2)
}
console.log(str2)

let a = 1, b =1

let o = {a,b}
console.log(o)