<template>
  <div id='u2-box'>    
    <div id='tag'  v-if="$store.state.dataResetOk" key="tag">
      <ul class="nav nav-tabs">
        <li v-for="(v,i) in curDevs" :key="i" @click="changeTag(i)" class="nav-item" >
        <a :class="{active: actDataIdx==i}" 
        class="nav-link" aria-current="page" href="#">{{v.name}}</a>
        </li>
      </ul>
    </div> 
    
    <div style="margin-left: 80px;"  v-if="$store.state.dataResetOk" key="data">
      <!-- 会话监听 -->
      <div id="getMsg" style="margin-top:50px; display: flex; align-items: center">
        <div class="form-check form-switch">
          <label class="form-check-label" for="flexSwitchCheckDefault4">会话监听</label>
          <input @click="toggleMsgBtn()" :checked="dataState[actDataIdx][8]" :disabled="!haveDev"
          class="form-check-input" type="checkbox" id="flexSwitchCheckDefault4">
        </div>
        <div><span v-show="dataState[actDataIdx][8]">{{pageData[actDataIdx][8]}}</span></div>
      </div>
      <!-- 数据框监听 -->
      <div id="getData">
        <div id='Cnum1'>
          <div v-for="(v, i) in Array(4)" :key="i" class="infoData">
            <div class="form-check form-switch">
              <label class="form-check-label" :for="`flexSwitchCheckDefault${i}`">数据{{String.fromCharCode(65+i)}}</label>
              <input @click="toggleDataBtn(i)" :checked="dataState[actDataIdx][i]" :disabled="!haveDev"
              class="form-check-input" type="checkbox" :id="`flexSwitchCheckDefault${i}`">
            </div>
            <div><span v-show="dataState[actDataIdx][i]">{{pageData[actDataIdx][i]}}</span></div>
          </div>
        </div>
        <div id="Cnum2">
          <button @click="collapseFlag=!collapseFlag" 
          class="btn btn-sm btn-outline-info" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCnum" aria-expanded="false" aria-controls="collapseExample">
            {{collapseFlag?"+":"-"}}
          </button>
          <div class="collapse" id="collapseCnum">
            <div>
              <div v-for="(v, i) in Array(4)" :key="i" class="infoData">
                <div class="form-check form-switch">
                  <label class="form-check-label" :for="`flexSwitchCheckDefault${i+4}`">数据{{String.fromCharCode(69+i)}}</label>
                  <input @click="toggleDataBtn(i+4)" :checked="dataState[actDataIdx][i+4]" :disabled="!haveDev"
                  class="form-check-input" type="checkbox" :id="`flexSwitchCheckDefault${i+4}`">
                </div>
                <div><span v-show="dataState[actDataIdx][i+4]">{{pageData[actDataIdx][i+4]}}</span></div>
              </div>
            </div>    
          </div>
        </div>
      </div>
      <!-- 图表显示 -->
      <div id="graphData">
        <span >折线图</span>
        <div>
          <div id='graphCheck' style="float: left;">
            <div>
              <div v-for="(v, i) in Array(8)" :key="i" class="form-check-inline graph-radio align-middle">
                <input :id="`flexCheckDefault${i+1}`" :disabled="!(haveDev&&dataState[actDataIdx][i])" :checked="dataState[actDataIdx][9]==i" @click="toggleGraBtn(i)"
                class="form-check-input" type="radio" name="gra">
                <label class="form-check-label" :for="`flexCheckDefault${i+1}`">
                {{String.fromCharCode(65+i)}}
                </label>
              </div>
            </div>
          </div>
          <div v-show="dataState[actDataIdx][9]!=-1" id='graphCtrl' style="float: right;" > 
            <div v-for="(v, i) in graCtrls" :key="i" :id="v.id" @click="graIconClick(i)"
            class="align-middle bgWhite" :style="{backgroundImage: `url(${require('img/u2/'+v.img)})`}">
              <a v-if="i===2" 
              :href="excelInfo.link"  ref="excelA" :download="excelInfo.name"
              ><span></span></a>
            </div>
          </div>
        </div> 
      </div>
    </div>
    <div id="graph" key="gra" ><div ref="gra"></div></div>
    <!-- 仪表板 -->
    <div id="panel-box">
      <span>仪表盘</span>
      <div id="panel-check">
        <div class="form-check" v-for="(v, i) in 4" :key="i">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"
          @click="panelCheckClick(i)" :disabled="!(haveDev&&dataState[actDataIdx][i])" :checked="panelSettings[actDataIdx][i].show">
          <label class="form-check-label" for="flexCheckDefault">{{String.fromCharCode(65+i)}}</label>
        </div>
      </div>
      <ul id="panel">
        <li v-for="(v, i) in 4" :key="i" ref="pan">
          <div class="panel-main" v-if="panelSettings[actDataIdx][i].show">
            <div class="panel-gra" ref="pg"></div>
            <div class="panel-data" @click="panelSetIdx=i" data-bs-toggle="modal" data-bs-target="#panelSetModal">
              <span>数据{{String.fromCharCode(65+i)}}</span>
              <div class="setpanel"></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <p-comment :c_actDid="actDid" v-if="$store.state.dataResetOk"/>
    <!-- panel set Modal -->
    <div class="modal fade" id="panelSetModal"  data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
    <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="staticBackdropLabel">数据{{String.fromCharCode(65+panelSetIdx)}}-仪表盘设置</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div v-for="(v,i) in panelSetTag" :key="i" class="input-group input-group-sm mb-3">
        <span class="input-group-text">{{v}}</span>
        <input type="text" class="form-control" aria-label="Sizing example input">
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
      <button type="button" class="btn btn-primary">确定</button>
    </div>
    </div>
    </div>
    </div>
  </div>
</template>

<script>
const PComment = res => require(["components/private/PComment"], res)
import genWorkbook from "utils/genWorkbook"
import {mapState} from "vuex"

export default {
  data () {
    return {
      collapseFlag: 1,
      graShowFlag: 0,
      myGraph: undefined,
      panelGraph: [], panelSetIdx: 0, panelSetTag: ["主题", "单位", "最小值", "最大值"],
      timGra: 0,
      actDataIdx: 0,
      excelInfo: {
        disabled: 1,
        name: "",
        link: ""
      }
    }
  },
  computed: {
    graCtrls: function () {
      return [
        {id: "psGraph", img: `play${this.graShowFlag}.png`},
        {id: "clearGraph", img: "clear.png"},
        {id: "excelGraph", img: "excel.png"}
      ]
    },
    curDevs: function () {return this.$store.state.curDevs},
    dataState: function () {return this.$store.state.dataState},
    actDid: function () {return this.curDevs[this.actDataIdx].did},
    act_id: function () {return this.curDevs[this.actDataIdx]._id},
    actName: function () {return this.curDevs[this.actDataIdx].name},
    timData: function () {return this.$store.state.timData},
    haveDev: function () {return this.curDevs.length},
    pageData: function () {return this.$store.state.pageData},
    graCache: function () {return this.$store.state.graCache},
    ...mapState(["panelSettings"])

  },
  components: {
    "p-comment": PComment
  },
  methods: {
    /* 切换设备标签页 */
    changeTag (i) {
      this.actDataIdx = i
      this.graShowFlag = 0
      clearInterval(this.timGra)
      if (this.dataState[this.actDataIdx][9] == -1) this.myGraph.clear()
      else {
        this.myGraph.clear()
        let n = this.dataState[this.actDataIdx][9]
        let title = this.actName + "-数据" + String.fromCharCode(65+n)
        this.drawGraph(title, this.graCache[this.actDataIdx][i]) 
      }
      setTimeout(()=>{
        for(let i=0; i<4; i++) {
          if (this.panelSettings[this.actDataIdx][i].show) {
            this.panelGraph[i] = this.$echarts.init(this.$refs.pan[i].children[0].children[0])
            this.drawPanel(i)
          }
        }        
      },100)

    },
    toggleDataBtn (i, inv=2000) {
      this.$store.commit("changeBtnVal", {k: "dataState", i: this.actDataIdx, j: i})
      console.log('---',this.actDataIdx)
      if (this.dataState[this.actDataIdx][i]) {
        let act_id = this.act_id 
        let t = setInterval(() => {
          // console.log(this.actDid)
          this.rReqData(i, act_id)
        }, inv)
        this.$store.commit("changeArrVal", {k: "timData", v: t, idx:[this.actDataIdx,i]})
      } else {
        clearInterval(this.timData[this.actDataIdx][i])
        if (i == this.dataState[this.actDataIdx][9]) {
          try {
            clearInterval(this.timGra)
            this.myGraph.clear()
            this.$store.commit("changeArrVal", {k:"dataState", v:-1, idx:[this.actDataIdx,9]})
            this.graShowFlag = 0
          }catch (e) {console.log('fail-',e)}
        }
        //清空仪表盘
        this.$store.commit("changePanelVal", {devIdx:this.actDataIdx, dataIdx:i, k:"show", v:false})
      }
    },
    toggleMsgBtn (inv=2000) {
      this.$store.commit("changeBtnVal", {k: "dataState", i: this.actDataIdx, j: 8})
      if (this.dataState[this.actDataIdx][8]) {
        let act_id = this.act_id
        /* 待完成 */ 
        let t = setInterval(() => {
          this.rReqMsg(act_id)
        }, inv)
        this.$store.commit("changeArrVal", {k: "timData", v: t, idx:[this.actDataIdx,8]})
      } else {
        if (this.timData[this.actDataIdx][8]) clearInterval(this.timData[this.actDataIdx][8])
      }
    },
    graIconClick (i) {
      switch (i) {
        case 0:
          this.graShowFlag = Number(!this.graShowFlag)
          if (this.graShowFlag) {
            this.myGraph.clear()
            clearInterval(this.timGra)            
            let n = this.dataState[this.actDataIdx][9]
            let title = this.actName + "-数据" + String.fromCharCode(65+n)
            this.drawGraph(title, this.graCache[this.actDataIdx][n])
            let t =setInterval(()=>{  
              // console.log(i)
              this.drawGraph(title, this.graCache[this.actDataIdx][n])
            },2000)
            this.timGra = t
          } else clearInterval(this.timGra)
          break
        case 1:
          let n = this.dataState[this.actDataIdx][9]
          this.$store.commit("changeArrVal", {k:"dataState", v:-1, idx:[this.actDataIdx,9]})
          if (n>=0)
          this.$store.commit("changeArrVal", {k:"graCache", v:[], idx:[this.actDataIdx,n]})
          clearInterval(this.timGra)
          this.myGraph.clear()
          break
        case 2:
          var event = new MouseEvent("click", {bubbles:false})
          ;(async () => {
            try {
              let n = this.dataState[this.actDataIdx][9]
              let dName = `数据${String.fromCharCode(65+n)}`
              let dataName = `${this.$store.state.curName}_${this.actName}${dName}`
              let data = this.graCache[this.actDataIdx][n]
              let workbook = genWorkbook(data, dataName)
              const buf = await workbook.xlsx.writeBuffer()
              this.excelInfo.disabled = 0
              this.excelInfo.link = URL.createObjectURL(new Blob([buf.buffer]))
              this.excelInfo.name = `${dataName}_${new Date().getTime()}.xlsx`
              setTimeout(()=>{this.$refs.excelA[0].dispatchEvent(event)},100)
            } catch(e) {console.log(e)}
          })()
          break
      }
    },
    rReqMsg (act_id) {
      fetch('/api/data/reqMsg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          _id: act_id
        })
      })
      .then(res => res.json()
      .then(data => {
        let msg = data.val
        this.$store.commit("changeMsg", {k: act_id, v: msg, l: this.$store.getters._idArr})
      }))            
    },
    rReqData (i, act_id) {
      fetch(`/api/data/reqData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          _id:act_id, i
        })
      })
      .then(res => res.json()
      .then(data => {
        let num
        if (i < 4) num = data.val[i]
        else num = data.val[i-4]
        if (!isNaN(num)) {
          if(num%1 !== 0) num = num.toFixed(2)
          else num = parseInt(num)
          console.log(num)
          this.$store.commit("changeGraCache", {k: act_id, i: i, v: num, l: this.$store.getters._idArr})
        } 
      }))
    },
 
    toggleGraBtn (i) {
      this.graShowFlag = 0
      if (this.timGra) clearInterval(this.timGra)  
      this.$store.commit("changeArrVal", {k:"dataState", v:i, idx:[this.actDataIdx,9]})
      this.myGraph.clear()
      let n = this.dataState[this.actDataIdx][9]
      let title = this.actName + "-数据" + String.fromCharCode(65+n)
      this.drawGraph(title, this.graCache[this.actDataIdx][i])   
    },    
      /* 绘制图表 */
    drawGraph (gTitle, data) {
      let option
      var dateList = data.map(function (item) {
          return item[0];
      });
      var valueList = data.map(function (item) {
          return item[1];
      });

      option = {
        // Make gradient line here
        visualMap: [{
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: 0,
            max: 400
        }],
        title: [{
            left: 'center',
            text: gTitle
        }],
        tooltip: {
            trigger: 'axis'
        },
        xAxis: [{
            data: dateList
        }],
        yAxis: [{
        }],
        grid: [{
            bottom: '5%'
        }],
        series: [{
            type: 'line',
            showSymbol: false,
            data: valueList
        }]
      }; 
      // myGraph.clear()
      option && this.myGraph.setOption(option)   
    },
    /* 仪表盘多选框点击 */
    panelCheckClick (i) {
      
      if (this.panelSettings[this.actDataIdx][i].show) {
        this.$store.commit("changePanelVal", {devIdx:this.actDataIdx, dataIdx:i, k:"show", v:false})
      } else {
        this.$store.commit("changePanelVal", {devIdx:this.actDataIdx, dataIdx:i, k:"show", v:true})
        setTimeout(()=>{
          console.log("pccccc-----", i,this.$refs.pan[i])
          this.panelGraph[i] = this.$echarts.init(this.$refs.pan[i].children[0].children[0])
          this.drawPanel(i)
        },50)
      }
      
      
    },
    /* 绘制仪表盘 */
    drawPanel (i) {
      console.log(this.panelGraph[i])
      var option = {
        series: [
          {
            type: 'gauge',
            min: 0,
            max: 1023,
            minInterval: 1,
            axisLine: {
              lineStyle: {
                width: 15,
                color: [
                  [0.3, '#67e0e3'],
                  [0.7, '#37a2da'],
                  [1, '#fd666d']
                ]
              }
            },
            pointer: {
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              distance: -15,
              length: 8,
              lineStyle: {
                color: '#fff',
                width: 1
              }
            },
            splitLine: {
              distance: -15,
              length: 15,
              lineStyle: {
                color: '#fff',
                width: 3
              }
            },
            axisLabel: {
              formatter (val) {return parseInt(val)},
              color: 'auto',
              distance: 25,
              fontSize: 11
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} km/h',
              color: 'auto',
              fontSize: 20
            },
            data: [
              {
                value: 70
              }
            ]
          }
        ]
      };
      option && this.panelGraph[i].setOption(option)    
    }
  },
  created () {
    console.log("u2 created")
  },
  mounted () {
    this.myGraph = this.$echarts.init(this.$refs.gra)
  },
  beforeDestroy () {
    clearInterval(this.timGra)
    this.graShowFlag = 0
  },
}
</script>

<style scoped src="views/user/u2/u2.scss" lang="scss"></style>