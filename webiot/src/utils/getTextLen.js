function getTextLen(str){
  let n=0;
  for(var i=0;i<str.length;i++){
   if(str.charCodeAt(i)>=0&&str.charCodeAt(i)<=256){n+=1;}
   else{n+=2;}
  }
  return n  
}

export default getTextLen