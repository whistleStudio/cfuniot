<!-- intro -->
<template>
  <div id="intro">
    
    <iframe src="static/iotguide/iotguide.html" frameborder="0" ref="ifr"
    width="100%"   scrolling="auto"
    ></iframe>
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
        console.log("scroll")
      }
    },
    components: {},
    mounted () {
      this.$refs.ifr.contentWindow.addEventListener("scroll", function (ev) {
        // console.log(ev.scrollTop)
      })
    }
  }
</script>

<style scoped>
iframe {
  height: calc(100vh - 90px);
}
</style>