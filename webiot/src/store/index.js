import Vue from "vue";
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    curName: "", curMail: "", curAvatar: 0, curAuth: Number, 
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
      state[pl.k] = pl.v
    }
  },
  actions: {

  }
})

export default store