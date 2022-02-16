import Vue from "vue";
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    curName: "", curMail: "", curAvatar: 0, curAuth: Number, curAuthDate: "",
    curDevs: [],
    /* tim0-3 ~ data tim4 ~ graph tim5 ~ msg */
    tim: Array(6),
    /* 控制界面信息、按钮、滑杆状态 */
    curBtns: [], curRans: [],
    /* 数据监控更新计时器 */
    timData: [],
    /* 数据监控开关状态记录 idx0-3数据A-C idx末激活图表 */
    dataState: [],
    /* 每个设备每种数据的图表缓存数值 */
    graCache: [],
    /* 数据页激活设备索引 */
    actIdx: Number
  },
  mutations: {
    changeVal (state, pl) {
      // console.log(pl)
      state[pl.k] = pl.v
    },
    resetDevState (state) {
      for(let i in state.curDevs) {
        state.curBtns.push(Array(4).fill(0))
        state.curRans.push(Array(4).fill(0))
        state.timData.push(Array(8))
        state.dataState.push(Array(9).fill(0).concat(-1))
        state.graCache.push(Array(9).fill(0).map(e => Array()))
      }
    },
    addNewDev (state) {
      state.curBtns.push([0,0,0,0]) 
      state.curRans.push([0,0,0,0])
      state.timData.push(Array(8))
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
    }
  },
  actions: {

  }
})

export default store