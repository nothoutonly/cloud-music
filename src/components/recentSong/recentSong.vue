<template>
	<slide-to>
		<div class="dailyRecommend">
			<div class="header"
			     ref="header">
				<div class="back"
				     @click="back">
					<i class="iconfont icon-back"></i>
				</div>
				<div class="text">
					<h1 class="title">每日推荐</h1>
				</div>
			</div>
			<scroll class="list"
			        ref="scroll">
				<song-list @select="selectItem"
				           @sequence="sequence"
				           :songs="recommendMusic"></song-list>
			</scroll>
		</div>
	</slide-to>
</template>

<script>
import SlideTo from 'base/transition-slide/transition-slide'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import { mapActions } from 'vuex'
import { getRecommendMusic } from 'api/recommend'
import { createRecommendSong } from 'common/js/song'
import { ERR_OK } from 'common/js/config'
import { playlistMixin } from 'common/js/mixin'

export default {
	name: 'dailyRecommend',
	mixins: [playlistMixin],
	data() {
		return {
			recommendMusic: [],
		}
	},
	created() {
		this._getDailyRecommed()
	},
	methods: {
		handlePlaylist(playlist) {
			const bottom = playlist.length > 0 ? '60px' : ''
			// Vue组件的ref引用不能直接获取真实DOM，使用$el才能获取到
			this.$refs.scroll.$el.style.bottom = bottom
			this.$refs.scroll.refresh()
		},
		back() {
			this.$router.go(-1)
		},
		sequence() {
			this.sequencePlay({
				list: this.listDetail,
			})
		},
		selectItem(item) {
			this.insertSong(item)
		},
		_getDailyRecommed() {
			getRecommendMusic().then(res => {
				if (res.status === ERR_OK) {
					let list = res.data.result.map(item => {
						return createRecommendSong(item)
					})
					this.recommendMusic = list
				} else {
					console.error('getRecommendMusic 获取失败')
				}
			})
		},
		...mapActions(['sequencePlay', 'insertSong']),
	},
	computed: {},
	components: {
		SlideTo,
		Scroll,
		SongList,
	},
}
</script>

<style scoped lang="stylus">
@import '~common/style/variable';
@import '~common/style/mixin';

.dailyRecommend {
	fixed-page();

	.header {
		position: fixed;
		top: 0;
		width: 100%;
		height: 44px;
		background: $color-theme;
		color: $color-background;
		z-index: 50;

		.back {
			position: absolute;
			top: 0;
			left: 10px;

			.iconfont {
				line-height: 44px;
				font-size: 24px;
			}
		}

		.text {
			position: absolute;
			left: 50px;

			.title {
				line-height: 44px;
				font-size: 20px;
				no-wrap();
			}
		}
	}

	.list {
		fixed-page();
		top: 60px;

		.song-list-wrappper {
		}
	}
}
</style>
