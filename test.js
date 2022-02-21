let a ={
  b(){
    (()=> {
      console.log(this)
    }) ()
  }
}
console.log(Boolean({}))