<template>
  <slide-to>
    <music-list :musicList="topList"
                :coverImgUrl="coverImgUrl"></music-list>
  </slide-to>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import SlideTo from 'base/transition-slide/transition-slide'
import { mapGetters } from 'vuex'

export default {
	data() {
		return {}
	},
	methods: {},
	computed: {
		coverImgUrl() {
			return this.topList.coverImgUrl
		},
		...mapGetters(['topList']),
	},
	components: { SlideTo, MusicList },
}
</script>

<style scoped>
</style>