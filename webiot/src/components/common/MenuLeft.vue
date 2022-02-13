<template>
  <div id="menu">
    <ul>
      <li>{{menuHead.name}}</li>
      <li v-for="(v, i) in menuInfo" :key="i" @click="changePage(v.path)">{{v.name}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuHead: {name: "创趣物联", img:""},
      menuInfo: [
        {name: "设备信息", path: "device"},
        {name: "控制界面", path: "ctrl"},
        {name: "数据监控", path: "data"}
      ]
    }
  },
  methods: {
    changePage (p) {
      this.$router.push(`/user/${p}`)
    }
  }
}
</script>

<style scoped>
  #menu {
    position: fixed;
    width: 200px;
    height: 120vh;
    background-color: var(--rMainColor);
    color: white;
  }
  #menu>ul {
    padding-left: 0;
  }
  #menu li:first-of-type {
    background-color: var(--rMainColorDark);
  }
  #menu li {
    padding-left: 32px;
    font: 17px/80px sans-serif;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    cursor: pointer;
  }
</style>