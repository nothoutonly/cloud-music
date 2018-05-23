<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'

  export default {
    name: 'App',
    components: {
      MHeader, Tab
    }
  }
</script>

<style lang="stylus">
  @import 'common/style/index.styl'
  #app
    position: fixed
    top: 0
    height: 100%
    width: 100%
    overflow: hidden

</style>
