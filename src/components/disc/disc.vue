<template>
  <slide-to>
    <music-list :musicList="musicList"></music-list>
  </slide-to>
</template>

<script>
import SlideTo from 'base/transition-slide/transition-slide'
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'

export default {
	data() {
		return {}
	},
	methods: {},
	computed: {
		...mapGetters(['musicList']),
	},
	components: {
		SlideTo,
		MusicList,
	},
}
</script>

<style scoped>
</style>