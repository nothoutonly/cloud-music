<template>
	<slide-to>
		<div class="songCollection">
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
				<ul>
					<li class="item"
					    v-for="item in discList"
					    :key="item.id"
					    @click="selectList(item)">
						<div class="icon">
							<div class="gradients"></div>
							<img v-lazy="item.picUrl">
						</div>
						<p class="play-count">
							<i class="iconfont icon-headphones"></i>
							{{Math.floor(item.playCount / 10000) }}万
						</p>
						<div class="text">
							<p class="name">{{item.name}}</p>
						</div>
					</li>
				</ul>
			</scroll>
		</div>
	</slide-to>
</template>

<script>
import SlideTo from 'base/transition-slide/transition-slide'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import { mapActions, mapMutations } from 'vuex'
import { playlistMixin } from 'common/js/mixin'
import { getRecommendList } from 'api/recommend'
import { ERR_OK } from 'common/js/config'

export default {
	name: 'songCollection',
	mixins: [playlistMixin],
	data() {
		return {
			discList: [],
		}
	},
	created() {
		this._getRecommendList()
	},
	methods: {
		handlePlaylist(playlist) {
			const bottom = playlist.length > 0 ? '60px' : ''
			this.$refs.scroll.$el.style.bottom = bottom
			this.$refs.scroll.refresh()
		},
		back() {
			this.$router.go(-1)
		},
		selectList(item) {
			this.$router.push({
				path: `/recommend/${item.id}`,
			})
			this.setMusicList(item)
		},
		_getRecommendList() {
			getRecommendList().then(res => {
				if (res.status === ERR_OK) {
					this.discList = res.data.result
				} else {
					console.error('getRecommendList 获取失败')
				}
			})
		},
		...mapMutations({
			setMusicList: 'SET_MUSIC_LIST',
		}),
	},
	computed: {},
	components: {
		SlideTo,
		Scroll,
	},
}
</script>

<style scoped lang="stylus">
@import '~common/style/variable';
@import '~common/style/mixin';

.songCollection {
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

		.item {
			display: inline-block;
			position: relative;
			box-sizing: border-box;
			width: 50%;
			padding: 0 1%;

			.icon {
				position: relative;
				display: inline-block;
				width: 100%;
				margin-bottom: 5px;
				border-radius: 3px;

				.gradients {
					position: absolute;
					top: 0;
					width: 100%;
					height: 35px;
					border-radius: 3px;
					background: linear-gradient(rgba(109, 109, 109, 0.4), rgba(255, 255, 255, 0));
				}

				img {
					width: 100%;
					height: 100%;
				}
			}

			.play-count {
				position: absolute;
				top: 5px;
				right: 8px;
				font-size: $font-size-small-s;
				color: $color-text-ggg;

				.iconfont {
					font-size: $font-size-small-s;
				}
			}

			.text {
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
				text-overflow: ellipsis;
				height: 2.5em;
				line-height: 1.2;
				margin-bottom: 10px;
				font-size: $font-size-small;
				color: $color-text;
			}

			p.text {
				line-height: 16px;
				height: 16px;
				margin-bottom: 0;
				no-wrap();
			}

			.singer {
				line-height: 16px;
				margin-bottom: 10px;
				text-align: left;
				no-wrap();
				font-size: $font-size-small;
				color: $color-text-sub;
			}
		}
	}
}
</style>
