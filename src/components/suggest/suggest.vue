<template>
	<div class="suggest">
		<div class="search-suggest"
		     v-show="searchResultShow">
			<p class="title"
			   v-show="suggest.artists && suggest.albums">最佳匹配</p>
			<div class="search-suggest-item"
			     v-if="suggest.artists"
			     @click="selectSinger(suggest.artists[0])">
				<img :src="suggest.artists[0].img1v1Url"
				     width="50"
				     height="50"
				     alt="">
				<span>歌手：{{suggest.artists[0].name}}</span>
			</div>
			<div class="search-suggest-item"
			     v-if="suggest.playlists"
			     @click="selectDisc(suggest.playlists[0])">
				<img :src="suggest.playlists[0].coverImgUrl"
				     width="50"
				     height="50"
				     alt="">
				<div class="text">
					<p>歌单：{{suggest.playlists[0].name}}</p>
					<p class="singer">{{suggest.albums[0].artist.name}}</p>
				</div>
			</div>
		</div>
		<ul class="suggest-list"
		    v-show="songs.length"
		    ref="suggestList">
			<li class="suggest-item"
			    @click="selectSong(item)"
			    v-for="(item,index) in songs"
			    :key="index">
				<div class="song">
					<p class="name">{{item.name}}</p>
					<p class="singer">{{item.singer}}</p>
				</div>
			</li>
			<loading v-show="hasMore"></loading>
		</ul>
		<div class="no-result-wrapper"
		     v-show="!suggest && query && !songs.length && searchResultShow">
			抱歉，暂无搜索结果
		</div>
	</div>
</template>

<script>
import Loading from 'base/loading/loading'

import Singer from 'common/js/singer'
import { getSearchSongs, getSearchSuggest, getSongDetail } from 'api/search'
import { createSearchSong } from 'common/js/song'
import { mapMutations, mapActions } from 'vuex'

export default {
	props: {
		query: {
			type: String,
			default: '',
		},
		showSinger: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			page: 0,
			songs: [],
			hasMore: true,
			suggest: [],
			searchResultShow: false,
		}
	},
	methods: {
		selectSinger(item) {
			this.$router.push('/singer')
			this.setSinger(item)
		},
		selectDisc(item) {
			item.picUrl = item.coverImgUrl
			this.$router.push(`/search/disc/${item.id}`)
			this.setMusicList(item)
		},
		selectSong(item) {
			getSongDetail(item.id).then(res => {
				let resSong = res.data.songs[0]
				item.image = resSong.al.picUrl
				item.duration = resSong.dt / 1000
				this.insertSong(item)
			})
		},
		search() {
			this.searchResultShow = true
			this.page = 0
			this.hasMore = true
			getSearchSongs(this.query, this.page)
				.then(res => {
					if (!res.data.result.songs) {
						this.haveMore = false
						return
					}
					let list = res.data.result.songs
					let ret = []
					list.forEach(item => {
						ret.push(createSearchSong(item))
					})
					this.songs = ret
					if (ret.length < 30) {
						console.log('less result')

						this.hasMore = false
					}
					this.$emit('refresh')
					this.page += 30
				})
				.catch(err => {})
			getSearchSuggest(this.query).then(res => {
				this.suggest = res.data.result
			})
		},
		searchMore() {
			if (!this.hasMore) {
				return
			}
			getSearchSongs(this.query, this.page)
				.then(res => {
					if (!res.data.result.songs) {
						this.haveMore = false
						return
					}
					let list = res.data.result.songs
					let ret = []
					list.forEach(item => {
						ret.push(createSearchSong(item))
					})
					this.songs = this.songs.concat(ret)
					this.$emit('refresh')
					this.page += 30
				})
				.catch(err => {})
		},
		...mapMutations({
			setMusicList: 'SET_MUSIC_LIST',
			setSinger: 'SET_SINGER',
		}),
		...mapActions(['insertSong']),
	},
	computed: {},
	watch: {
		query(val) {
			if (val === '') {
				this.suggest = {}
				this.songs = []
				this.hasMore = false
				this.searchResultShow = false
				return
			}
			this.suggest = {}
			this.songs = []
			this.searchResultShow = true
			this.page = 0
			this.haseMore = true
			this.search()
		},
	},
	components: {
		Loading,
	},
}
</script>

<style scoped lang="stylus">
@import '~common/style/variable';
@import '~common/style/mixin';

.suggest {
	height: 100%;
	overflow: hidden;

	.search-suggest {
		.title {
			padding-left: 20px;
			padding-bottom: 10px;
			color: $color-theme;
			font-size: 11px;
		}

		.search-suggest-item {
			display: flex;
			align-items: center;
			padding: 8px 20px;
			border-bottom: 1px solid $color-border;
			font-size: $font-size-medium;

			img {
				flex: 0 0 50px;
				padding-right: 15px;
			}

			.text {
				width: 100%;

				p {
					padding: 3px 0;
					no-wrap();
				}

				.singer {
					font-size: $font-size-small-x;
					color: $color-text;
				}
			}
		}
	}

	.suggest-list {
		padding-bottom: 60px;

		.suggest-item {
			display: flex;
			align-items: center;
			height: 50px;
			padding: 3px 20px;
			border-bottom: 1px solid $color-border;

			.song {
				flex: 1;
				font-size: $font-size-medium;
				color: $color-text-sub;
				overflow: hidden;

				p {
					padding: 3px 0;
					no-wrap();
				}

				.name {
					font-size: $font-size-medium-x;
					color: $color-text;
				}

				.singer {
					font-size: 12px;
					color: $color-text-g;
				}
			}
		}
	}

	.no-result-wrapper {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translate3d(0, -50%, 0);
	}
}
</style>