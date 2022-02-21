import Vue from "vue";
import Vuex from "vuex"
import dateFormat from "utils/dateFormat"

Vue.use(Vuex)
dateFormat()

const store = new Vuex.Store({
  state: {
    dataResetOk: 0,
    curName: "", curMail: "", curAvatar: 0, curAuth: Number, curAuthDate: "",
    curDevs: [],
    /* graph */
    timGra: {},
    /* 控制界面信息、按钮、滑杆状态 */
    curBtns: [], curRans: [],
    /* 数据监控更新计时器 idx0~7数据A-G idx8会话msg*/
    timData: [],
    /* 数据监控开关状态记录 idx0-3数据A-C idx4-7数据D-G idx8会话框 idx9对应激活图表 */
    dataState: [],
    /* 每个设备每种数据的图表缓存数值 */
    graCache: [],
    pageData: [],
    /* 激活Tag索引 */
    curActCtrlIdx: 0, curActDataIdx: 0, actIdx: Number
  },
  mutations: {
    changeVal (state, pl) {
      state[pl.k] = pl.v
    },
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
    resetDevState (state) {
      for(let i in state.curDevs) {
        state.curBtns.push(Array(4).fill(0))
        state.curRans.push(Array(4).fill(0))
        state.timData.push(Array(9))
        state.dataState.push(Array(9).fill(0).concat(-1))
        state.graCache.push(Array(8).fill(0).map(e => Array()))
        state.dataResetOk = 1
      }
    },
    addNewDev (state) {
      state.curBtns.push([0,0,0,0]) 
      state.curRans.push([0,0,0,0])
      state.timData.push(Array(9))
      state.dataState.push(Array(9).fill(0).concat(-1))
      state.graCache.push(Array(8).fill(0).map(e => Array()))
    },
    delDev (state, idx) {
      state.curBtns.splice(idx, 1)
      state.curRans.splice(idx, 1)
      if (state.timData[idx]) {
        clearInterval(state.timData[idx])
      }
      state.timData.splice(idx, 1)
      state.dataState.splice(idx, 1)
      state.graCache.splice(idx, 1)      
    },
    changeGraCache (state, {k,i,v}) {
      let arr =  state.graCache[k][i], curT = new Date().Format('HH:mm:ss')
      if (arr.length >= 200) arr.shift()
      arr.push([curT, v]) 
    }
  }
})

export default store