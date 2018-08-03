<template>
	<slide-to>
		<div class="rank"
		     ref="rank">
			<div class="header"
			     ref="header">
				<div class="back"
				     @click="back">
					<i class="iconfont icon-back"></i>
				</div>
				<div class="text">
					<h1 class="title">排行榜</h1>
				</div>
			</div>
			<scroll ref="scroll"
			        :data="yunTopList"
			        class="toplist">
				<ul>
					<li class="item"
					    v-for="item in yunTopList"
					    :key="item.id"
					    @click="selectItem(item)">
						<div class="icon">
							<img v-lazy="item.coverImgUrl">
						</div>
						<ul class="songlist">
							<li class="song"
							    v-for="(song, index) in item.top"
							    :key="index">
								<span>{{index + 1}}.</span>
								<span>{{song.name}} - {{song.ar[0].name}}</span>
							</li>
						</ul>
					</li>
				</ul>
			</scroll>
			<div v-show="showLoading"
			     class="loading-content">
				<loading></loading>
			</div>
			<router-view></router-view>
		</div>
	</slide-to>
</template>

<script>
import SlideTo from 'base/transition-slide/transition-slide'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { mapMutations } from 'vuex'
import { getTop } from 'api/rank'
import { playlistMixin } from 'common/js/mixin'

const YUNMUSIC_TOP = [0, 1, 2, 3, 4, 22, 23]

export default {
	mixins: [playlistMixin],
	data() {
		return {
			yunTopList: [],
			showLoading: true,
		}
	},
	created() {
		this._getTopList()
	},
	methods: {
		back() {
			this.$router.push('./recommend')
		},
		selectItem(item) {
			this.$router.push({
				path: `/rank/${item.id}`,
			})
			this.setTopList(item)
		},
		handlePlaylist(playlist) {
			const bottom = playlist.length > 0 ? '60px' : ''
			this.$refs.rank.style.bottom = bottom
			this.$refs.scroll.refresh()
		},
		_getTopList() {
			for (let i = 0; i < YUNMUSIC_TOP.length; i++) {
				getTop(YUNMUSIC_TOP[i]).then(res => {
					let list = res.data.playlist
					list.top = res.data.playlist.tracks.slice(0, 3)
					this.yunTopList.push(list)
				})
				if (i === YUNMUSIC_TOP.length - 1) {
					this.showLoading = false
				}
			}
		},
		...mapMutations({
			setTopList: 'SET_TOP_LIST',
		}),
	},
	components: {
		Scroll,
		Loading,
		SlideTo,
	},
}
</script>

<style scoped lang="stylus">
@import '~common/style/variable';
@import '~common/style/mixin';

.rank {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background: $color-background;

	.header {
		position: fixed;
		top: 0;
		width: 100%;
		height: 44px;
		background: $color-theme;
		color: $color-background;
		z-index: 50;
		font-size: 0;

		.back {
			position: absolute;
			left: 16px;

			.iconfont {
				line-height: 44px;
				font-size: 20px;
			}
		}

		.text {
			position: absolute;
			left: 48px;
			line-height: 44px;
			font-size: $font-size-large;

			.title {
				no-wrap();
			}
		}
	}

	.toplist {
		position: fixed;
		top: 44px;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		padding-top: 5px;

		.item {
			display: flex;
			margin: 0 10px;
			padding: 1px 0;
			height: 120px;
			border-bottom: 1px solid $color-border;

			&:last-child {
				padding-bottom: 20px;
			}

			.icon {
				flex: 0 0 120px;

				img {
					width: 100%;
					height: 100%;
					border-radius: 3px;
				}
			}

			.songlist {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding: 0 10px;
				overflow: hidden;
				color: $color-text;
				font-size: $font-size-medium;

				.song {
					line-height: 32px;
					no-wrap();
				}
			}
		}
	}

	.loading-content {
		position: fixed;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
}
</style>
