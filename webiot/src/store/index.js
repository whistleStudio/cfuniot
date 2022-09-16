
// import Vuex from "vuex"
import dateFormat from "utils/dateFormat"

Vue.use(Vuex)
Vue.config.devtools = true
dateFormat()

const store = new Vuex.Store({
  state: {
    dataResetOk: 0,
    curName: "", curMail: "", curAvatar: 0, curAuth: Number, curAuthDate: "", curRole: "",
    curDevs: [],
    /* graph */
    timGra: {},
    /* 控制界面信息、按钮、滑杆状态 */
    curBtns: [], curRans: [], curBtnMode: [],
    /* 数据监控更新计时器 idx0~7数据A-G idx8会话msg*/
    timData: [],
    /* 数据监控开关状态记录 idx0-3数据A-C idx4-7数据D-G idx8会话框 idx9对应激活图表 */
    dataState: [],
    /* 每个设备每种数据的图表缓存数值 */
    graCache: [],
    /* 当前页面缓存数据 idx0-7数值idx8会话*/
    pageData: [],
    /* 仪表盘配置 */
    panelSettings: []
  },
  getters: {
    _idArr: function (state) {
      let arr = []
      for (let v of state.curDevs) {
        arr.push(v._id)
      }
      return arr
    }
  },
  mutations: {
    resetDevState (state) {
      for(let i in state.curDevs) {
        state.curBtns.push(Array(4).fill(0))
        state.curRans.push(Array(4).fill(0))
        state.timData.push(Array(9))
        state.dataState.push(Array(9).fill(0).concat(-1))
        state.graCache.push(Array(8).fill(0).map(e => Array()))
        state.pageData.push(Array(8).fill('').concat('wait message...'))
        state.curBtnMode.push(Array(4).fill(0))
        state.panelSettings.push(Array(4).fill(0).map(e => {let o = {show: false, title:"", unit:"", min:0, max:100, data:0};return o}))
      }
      state.dataResetOk = 1
    },
    addNewDev (state) {
      state.curBtns.push([0,0,0,0]) 
      state.curRans.push([0,0,0,0])
      state.timData.push(Array(9))
      state.dataState.push(Array(9).fill(0).concat(-1))
      state.graCache.push(Array(8).fill(0).map(e => Array()))
      state.pageData.push(Array(8).fill('').concat('wait message...'))
      state.curBtnMode.push(Array(4).fill(0))
      state.panelSettings.push(Array(4).fill(0).map(e => {let o = {show:false, title:"", unit:"", min:0, max:100, data:0};return o}))
    },
    delDev (state, idx) {
      state.curBtns.splice(idx, 1)
      state.curRans.splice(idx, 1)
      state.timData[idx].forEach(t=>clearInterval(t))
      state.timData.splice(idx, 1)
      state.dataState.splice(idx, 1)
      state.graCache.splice(idx, 1)
      state.pageData.splice(idx, 1)   
      state.curBtnMode.splice(idx, 1)  
      state.panelSettings.splice(idx, 1)
    },
    changeVal (state, pl) {
      state[pl.k] = pl.v
    },
    //按钮状态 和 按钮模式共用
    changeBtnVal (state, {k,i,j}) {
      Vue.set(state[k][i], j, state[k][i][j]?0:1)
    },
    changeArrVal (state, {k,v,idx}) {
      let l = idx.length
      switch (l) {
        case 1:
          Vue.set(state[k], idx[0], v)
          break
        case 2:
          Vue.set(state[k][idx[0]], idx[1], v)
          break
        case 3:
          Vue.set(state[k][idx[0]][idx[1]], idx[2], v)
          break
      }
    },
    changeGraCache (state, {k,l,i,v}) {
      // 在删除设备和更改did的情况下，纠正索引
      k = l.indexOf(k)
      if (k>=0) {
        try {
          let arr = state.graCache[k][i], curT = new Date().Format('HH:mm:ss')
          if (arr.length >= 200) arr.shift()
          arr.push([curT, v])
          Vue.set(state.pageData[k], i, v)
        } catch (e) {}
      }
    },
    changeMsg (state, {k,l,v}) {
      k = l.indexOf(k)
      if (k>=0) {
        try {
          Vue.set(state.pageData[k], 8, v)
        } catch (e) {}
      }      
    },
    /* 改变仪表值 */
    changePanelVal ({panelSettings}, {devIdx, dataIdx, k, v}) {
      panelSettings[devIdx][dataIdx][k] = v
    }
  }
})

export default store