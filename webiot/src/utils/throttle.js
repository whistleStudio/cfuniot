function throttle (fn, t=300, info=1) {
  let valid = true
  return function () {
    // console.log(arguments)
    if (valid) {
      fn.call(this,...arguments)
      valid = false
      setTimeout(() => {
        valid = true
      }, t)
    } else {
      switch (info) {
        case 1: alert('数据发送频率过快，休息一会儿吧'); break;
      }
    }
  }
}
 export default throttle
