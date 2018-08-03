<template>
	<slide-to>
		<div class="singer">
			<div class="header"
			     ref="header">
				<div class="back"
				     @click="back">
					<i class="iconfont icon-back"></i>
				</div>
				<div class="text">
					<h1 class="title">{{singerDetail.name}}</h1>
				</div>
			</div>
			<scroll ref="scroll"
			        @scroll="scroll"
			        :probe-type="probeType"
			        :listen-scroll="listenScroll"
			        :data="hotSongs"
			        class="scroll-wrapper">
				<div>

					<div class="singer-avatar"
					     ref="avatar">
						<div class="filter"
						     ref="filter"></div>
						<div class="avatar">
							<img :src="singerDetail.picUrl"
							     alt="">
						</div>
					</div>
					<div class="song-list-wrapper">
						<song-list @select="selectItem"
						           @sequence="sequence"
						           :songs="hotSongs"></song-list>
					</div>
				</div>
			</scroll>
			<div class="loading-container"
			     v-show="!hotSongs.length">
				<loading></loading>
			</div>
		</div>
	</slide-to>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import SlideTo from 'base/transition-slide/transition-slide'
import Loading from 'base/loading/loading'
import SongList from 'base/song-list/song-list'
import { getSingerDetail } from 'api/singer'
import { getSingerHotSong } from 'common/js/song'
import { mapGetters, mapActions } from 'vuex'
import { prefixStyle } from 'common/js/dom'

const transform = prefixStyle('transform')
const PADDING_TOP = 44

export default {
	name: 'singer',
	data() {
		return {
			singerDetail: {},
			hotSongs: [],
			scrollY: 0,
		}
	},
	created() {
		this._getSingerDetail(this.singer.id)
		this.probeType = 3
		this.listenScroll = true
	},
	mounted() {
		this.avatarHeight = this.$refs.avatar.clientHeight
	},
	methods: {
		back() {
			this.$router.go(-1)
		},
		selectItem() {
			this.selectPlay({
				list: this.hotSongs,
				index,
			})
		},
		sequence() {
			this.sequencePlay({
				list: this.hotSongs,
			})
		},
		scroll(pos) {
			this.scrollY = pos.y
		},
		_getSingerDetail(id) {
			getSingerDetail(id)
				.then(res => {
					this.singerDetail = res.data.artist
					this.hotSongs = res.data.hotSongs.map(item => getSingerHotSong(item))
				})
				.catch(err => {})
		},
		...mapActions(['sequencePlay', 'selectPlay']),
	},
	computed: {
		...mapGetters(['singer']),
	},
	watch: {
		scrollY(newY) {
			let percent = Math.abs(newY / this.avatarHeight)
			if (newY < 0) {
				this.$refs.header.style.background = `rgba(211,47,47, ${percent})`
				this.$refs.filter.style.background = `rgba(0,0,0,${percent})`
			} else {
				this.$refs.avatar.style[transform] = `scale(${percent * 2 + 1})`
			}
		},
	},
	components: {
		SlideTo,
		Scroll,
		SongList,
		Loading,
	},
}
</script>

<style scoped lang="stylus">
@import '~common/style/variable';
@import '~common/style/mixin';

.singer {
	fixed-page();

	.header {
		position: fixed;
		top: 0;
		width: 100%;
		height: 44px;
		background: transparent;
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

	.scroll-wrapper {
		fixed-page();

		.singer-avatar {
			position: relative;
			width: 100%;
			height: 240px;

			.avatar {
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				z-index: -10;

				img {
					width: 100%;
				}
			}

			.filter {
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				z-index: -1;
				background-color: rgba(0, 0, 0, 0.05);
			}
		}

		.song-list-wrapper {
			position: relative;
			width: 100%;
		}
	}

	.loading-container {
		position: fixed;
		width: 100%;
		top: 60%;
	}
}
</style>
