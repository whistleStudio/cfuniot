<template>
  <div id='u2-box'>    
    <div id='tag'>
      <ul class="nav nav-tabs">
        <li class="nav-item" >
        <a class="nav-link active" aria-current="page" href="#">设备1</a>
        </li>
      </ul>
    </div> 
    
    <div style="float: left; margin-left: 80px;">
      <div id="getMsg" style="margin-top:50px; display: flex;">
        <div class="form-check form-switch">
          <label class="form-check-label" for="flexSwitchCheckDefault4">会话监听</label>
          <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault4">
        </div>
        <div>
        
        </div>
      </div>
    
      <div id="getData">
        <div id='Cnum1'>
          <div v-for="(v, i) in Array(4)" :key="i" class="infoData">
            <div class="form-check form-switch">
              <label class="form-check-label" :for="`flexSwitchCheckDefault${i}`">数据{{String.fromCharCode(65+i)}}</label>
              <input class="form-check-input" type="checkbox" :id="`flexSwitchCheckDefault${i}`">
            </div>
            <div>
              
            </div>
          </div>
        </div>
        <div id="Cnum2">
          <button class="btn btn-sm btn-outline-info" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCnum" aria-expanded="false" aria-controls="collapseExample">
            +
          </button>
          <div class="collapse" id="collapseCnum">
            <div>
              <div v-for="(v, i) in Array(4)" :key="i" class="infoData">
                <div class="form-check form-switch">
                  <label class="form-check-label" :for="`flexSwitchCheckDefault${i+4}`">数据{{String.fromCharCode(69+i)}}</label>
                  <input class="form-check-input" type="checkbox" :id="`flexSwitchCheckDefault${i+4}`">
                </div>
                <div>
                  
                </div>
              </div>
            </div>    
          </div>
        </div>
      </div>
     
      <div id="graphData">
        <span>折线图</span>
        <div>
          <div id='graphCheck' style="float: left;">
            <div>
              <div v-for="(v, i) in Array(8)" :key="i" class="form-check-inline graph-radio align-middle">
                <input class="form-check-input" type="radio" name="gra" :id="`flexCheckDefault${i+1}`">
                <label class="form-check-label" :for="`flexCheckDefault${i+1}`">
                {{String.fromCharCode(65+i)}}
                </label>
              </div>
            </div>
          </div>
          <div id='graphCtrl' style="float: right;">
            <div v-for="(v, i) in graCtrls" :key="i" :id="v.id" 
            class="align-middle bgWhite" :style="{backgroundImage: `url(${require('img/u2/'+v.img)})`}">
              <a v-if="i===1" class="disabledA"><span></span></a>
            </div>
          </div>
        </div>
        <div id="graph"></div>
      </div>
    </div>

    <p-comment></p-comment>
  </div>
</template>

<script>
import PComment from "components/private/PComment"

export default {
  data () {
    return {
      graCtrls: [
        {id: "psGraph", img: "play0.png"},
        {id: "clearGraph", img: "clear.png"},
        {id: "excelGraph", img: "excel.png"}
      ]
    }
  },
  components: {
    "p-comment": PComment
  }
}
</script>

<style scoped>
.bgWhite {
  background: white center/cover no-repeat;
}
#u2-box {
  width: 100%;
}

#tag {
  margin-top: 20px;
  margin-left: 80px;
}
#tag a {
  color: rgb(173, 181, 189);
}
#tag .active {
  color: rgb(77, 212, 172);
  font-weight: bold;
}


#getData {
  margin-top: 20px;
}
#Cnum1, #Cnum2>div>div {
  display: flex;
  align-content: center;
}
#Cnum2>button {
  margin: 15px 0px; 
  width: 160px;
  height: 20px;
  line-height: 10px !important;
  font-size: 20px;
}
.infoData {
  width: 250px;
  height: 100px;
  display: flex;
  flex-direction: column;
}
.infoData label, #getMsg label{
  padding-left: 20px;
  font: 17px/25px sans-serif;
}
.infoData input, #getMsg input{
  width: 60px !important;
  height: 25px;
}
.infoData>div:last-of-type {
  margin-top: 10px;
  width: 160px;
  height: 50px;
  font: 20px/50px sans-serif;
  box-sizing: border-box;
  background-color: rgba(255,255,255,0.8);
  border: 2px solid rgba(158, 234, 249, 0.8);
  border-radius: 10px;
  text-align: center;
}
#getMsg div:last-of-type {
  margin-left: 30px;
  width: 880px;
  height: 40px;
  background-color: rgba(255,255,255,0.8);
  border: 2px solid rgba(158, 234, 249, 0.5);
  border-radius: 10px;
  font: 20px/40px sans-serif;
}
#graphData>div:first-of-type {
  width: 1000px;
}

#graphCheck input{
  width: 20px;
  height: 20px;
}


#psGraph, #clearGraph, #excelGraph {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 1px 1px 1px 1px gray;
  margin-left: 10px;
}


.disabledA {
  pointer-events: none;
}

#graphData {
  margin-top: 30px;
}

#graphData>div:last-of-type {
  margin-top: 50px;
  width: 1000px;
  height: 450px;
  border: 1px solid gray;
  border-radius: 10px;
}
#graph {
  padding: 20px;
}




#psGraph:hover, #clearGraph:hover, #excelGraph:hover {
  box-shadow: 1px 1px 2px 1px gray inset;
}
</style>