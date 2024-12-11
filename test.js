function getLocalTime(i) { 
  if (typeof i !== 'number') return;

  var d = new Date(); 
  console.log(d)
  return new Date(d.getTime()+i*3600*1000);
}

let a = new Date().toISOString()
let reg = /.+-(.+)-(.+)T(.+):(.+):.+/
let mG = a.match(reg)


console.log(mG.filter((v, i) => i>0 && i<5).map(v => parseInt(v)))