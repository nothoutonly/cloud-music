<template>
  <div id="app">
    <index-header></index-header>
    <tab></tab>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import IndexHeader from 'components/index-header/index-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'

export default {
	name: 'App',
	components: {
		IndexHeader,
		Tab,
		Player,
	},
}
</script>

<style lang="stylus">
@import 'common/style/index.styl';

#app {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
