<template>
  <div class="recommend"
       ref="recommend">
    <scroll class="recommend-content"
            :data="recommendMusic"
            ref="scroll">
      <div>
        <div class="decorate"
             v-if="banner.length"></div>
        <div v-show="banner.length"
             class="banner-wrapper">
          <slider>
            <div v-for="item in banner"
                 :key="item.id"
                 @click.stop="selectBanner(item)">
              <img :src="item.picUrl"
                   @load="loadImg" />
            </div>
          </slider>
        </div>
        <action></action>
        <div class="recommend-list"
             ref="recommendList"
             v-if="playList && playList.length">
          <router-link to="/dailyRecom"
                       tag="h1"
                       class="title">推荐歌单
            <i class="iconfont icon-go"></i>
          </router-link>
          <ul>
            <li class="item"
                v-for="item in playList"
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
        </div>
        <div class="loading-wrapper"
             v-if="!playList && !playList.length">
          <loading></loading>
        </div>
        <div class="recommend-song"
             ref="recommendSong">
          <router-link tag="h1"
                       to="/recentSong"
                       class="title">最新歌曲
            <i class="iconfont icon-go"></i>
          </router-link>
          <ul>
            <li class="item"
                v-for="item in recommendMusic"
                :key="item.id"
                @click="selectSong(item)">
              <div class="icon">
                <img v-lazy="item.image">
              </div>
              <p class="text">{{item.name}}</p>
              <p class="singer">{{item.singer}}</p>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { ERR_OK } from 'common/js/config'
import Slider from 'base/slider/slider'
import Action from 'base/action/action'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getBanner, getRecommendList, getRecommendMusic } from 'api/recommend'
import { getSongDetail } from 'api/search'
import { createRecommendSong } from 'common/js/song'
import { mapMutations, mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

export default {
	name: 'recommend',
	mixins: [playlistMixin],
	data() {
		return {
			banner: [],
			playList: [],
			recommendMusic: [],
		}
	},

	created() {
		this._getBanner()
		this._getRecommendList()
		this._getRecommendMusic()
		this.loadBanner = false
	},

	methods: {
		handlePlaylist(playlist) {
			const bottom = playlist.length > 0 ? '60px' : ''
			// Vue组件的ref引用不能直接获取真实DOM，使用$el才能获取到
			this.$refs.recommend.style.bottom = bottom
			this.$refs.scroll.refresh()
		},
		selectBanner(item) {
			let regHttp = /^http/
			let regSong = /\/song\?id/
			if (regHttp.test(item.url)) {
				window.open(item.url)
			}
			if (regSong.test(item.url)) {
				getSongDetail(item.targetId).then(res => {
					let m = res.data.songs[0]
					let song = {
						id: m.id,
						singer: m.ar[0].name,
						name: m.name,
						image: m.al.picUrl,
						album: m.al.name,
						duration: m.dt / 1000,
					}
					this.insertSong(song)
				})
			}
		},
		selectList(item) {
			this.$router.push({
				path: `/recommend/${item.id}`,
			})
			this.setMusicList(item)
		},
		selectSong(item) {
			this.insertSong(item)
		},
		loadImg() {
			if (!this.checkLoad) {
				this.$refs.scroll.refresh()
				this.checkLoad = true
			}
		},
		_getBanner() {
			getBanner().then(res => {
				if (res.status === ERR_OK) {
					this.banner = res.data.banners
				} else {
					console.error('Banner 获取失败')
				}
			})
		},
		_getRecommendList() {
			getRecommendList().then(res => {
				if (res.status === ERR_OK) {
					this.playList = res.data.result.splice(0, 9)
				} else {
					console.error('getRecommendList 获取失败')
				}
			})
		},
		_getRecommendMusic() {
			getRecommendMusic().then(res => {
				if (res.status === ERR_OK) {
					let list = res.data.result.map(item => {
						return createRecommendSong(item)
					})
					list.splice(9)
					this.recommendMusic = list
				} else {
					console.error('getRecommendMusic 获取失败')
				}
			})
		},
		...mapMutations({
			setMusicList: 'SET_MUSIC_LIST',
		}),
		...mapActions(['insertSong']),
	},
	computed: {},
	components: {
		Slider,
		Action,
		Scroll,
		Loading,
	},
}
</script>

<style scoped lang="stylus">
@import '~common/style/variable';
@import '~common/style/mixin';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  z-index: 100;

  .recommend-content {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .decorate {
      position: absolute;
      top: -30vh;
      z-index: -10;
      background: $color-theme;
      width: 100%;
      height: 50vh;
      vertical-align: inherit;
    }

    .banner-wrapper {
      width: 96%;
      margin: 0 auto;
      border-radius: 5px;
      overflow: hidden;
      position: relative;
    }

    .recommend-list, .recommend-song {
      position: relative;
      box-sizing: border-box;
      width: 100%;

      .title {
        height: 50px;
        line-height: 50px;
        padding-left: 2%;
        font-size: $font-size-large;
        font-weight: bold;
        color: $color-text;

        .iconfont {
          color: $color-text;
          font-size: $font-size-large;
        }
      }

      .item {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        width: 33%;
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

    .loading-wrapper {
      position: relative;
      width: 100%;
      top: 50px;
    }
  }
}
</style>
