<!-- intro -->
<template>
  <div id="intro">
    <iframe src="static/iotguide/iotguide.html" frameborder="0" ref="ifr"
    width="100%"   scrolling="auto"
    ></iframe>
    <div @click="iframeScroll" id="toTop" ></div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      };
    },
    methods: {
      iframeScroll () {
        this.$refs.ifr.contentWindow.scrollTo({top: 0, behavior: 'smooth'})
      }
    },
    components: {},
    // mounted () {
    //   this.$refs.ifr.contentWindow.addEventListener("scroll", () => {
    //     console.log(this.$refs.ifr.contentWindow.scrollY)
    //   })
    // }
  }
</script>

<style scoped>
iframe {
  height: calc(100vh - 90px);
}
#toTop {
  width: 116px;
  height: 141px;
  position: fixed;
  right: 100px;
  bottom: 50px;
  background: url("~img/intro/toTop.png") center/cover no-repeat;
  cursor: pointer;
}
#toTop:hover {
  animation: jump 1s ease 3 forwards;
}
@keyframes jump {
    0% {bottom: 50px}
    50% {bottom: 80px}
    100% {bottom: 50px}
}
</style>