<template>
  <div class="music-list">
    <div class="header"
         ref="header">
      <div class="back"
           @click="back">
        <i class="iconfont icon-back"></i>
      </div>
      <div class="text">
        <h1 class="title">{{headerTitle}}</h1>
      </div>
    </div>
    <scroll class="list"
            ref="list"
            @scroll="scroll"
            :probe-type="probeType"
            :listen-scroll="listenScroll"
            :data="listDetail">
      <div class="music-list-wrapper"
           ref="musicListWrap">
        <section class="pl-header"
                 ref="bgImage">
          <div class="bg-image"
               :style="bgStyle"></div>
          <div class="filter"></div>
          <div class="plhead-wrapper">
            <div class="plhead_fl">
              <img :src="coverImg"
                   alt="">
              <div class="gradients">
                <span>{{playCount}}</span>
                <i class="iconfont icon-headphones"></i>
              </div>
            </div>
            <div class="plhead_fr">
              <h2 class="pl-title">{{title}}</h2>
              <h2 class="avatar">
                <img :src="avatarUrl"
                     alt="">
                <span>{{nickname}}</span>
              </h2>
            </div>
          </div>
        </section>
        <div class="song-list-wrapper">
          <song-list @select="selectItem"
                     @sequence="sequence"
                     :songs="listDetail"></song-list>
        </div>
      </div>
    </scroll>
    <div class="loading-container"
         v-show="!listDetail.length">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import SlideTo from 'base/transition-slide/transition-slide'
import { mapActions } from 'vuex'
import { getRecommendListDetail } from 'api/recommend'
import { ERR_OK } from 'common/js/config'
import { createRecommendListSong } from 'common/js/song'
import { playlistMixin } from 'common/js/mixin'

const PADDING_TOP = 50

export default {
	name: 'music-list',
	mixins: [playlistMixin],
	props: {
		musicList: {
			type: Object,
			default: null,
		},
		coverImgUrl: {
			type: String,
			default: null,
		},
	},
	data() {
		return {
			headerTitle: '歌单',
			avatarUrl: '',
			nickname: '',
			listDetail: [],
			scrollY: 0,
		}
	},
	created() {
		this._getRecommendListDetail(this.musicList.id)
		this.probeType = 3
		this.listenScroll = true
	},
	mounted() {
		this.bgImageHeight = this.$refs.bgImage.clientHeight
	},
	methods: {
		handlePlaylist(playlist) {
			const bottom = playlist.length > 0 ? '60px' : ''
			this.$refs.list.$el.style.bottom = bottom
			this.$refs.list.refresh()
		},
		back() {
			this.$router.go(-1)
		},
		scroll(pos) {
			this.scrollY = pos.y
		},
		sequence() {
			this.sequencePlay({
				list: this.listDetail,
			})
		},
		selectItem(item, index) {
			this.selectPlay({
				list: this.listDetail,
				index,
			})
		},
		_getRecommendListDetail(id) {
			if (!id) {
				this.$router.go(-1)
				return
			}
			getRecommendListDetail(id).then(res => {
				if (res.status === ERR_OK) {
					this.avatarUrl = res.data.result.creator.avatarUrl
					this.nickname = res.data.result.creator.nickname
					this.listDetail = res.data.result.tracks.map(item => {
						return createRecommendListSong(item)
					})
				} else {
					console.error('getRecommendListDetail 获取失败！')
				}
			})
		},
		...mapActions(['sequencePlay', 'selectPlay']),
	},
	computed: {
		playCount() {
			if (!this.musicList.playCount) {
				return
			}
			if (this.musicList.playCount < 1e5) {
				return Math.floor(this.musicList.playCount)
			} else {
				return Math.floor(this.musicList.playCount / 10000) + '万'
			}
		},
		coverImg() {
			return this.coverImgUrl ? this.coverImgUrl : this.musicList.picUrl
		},
		bgStyle() {
			return `background-image: url(${this.coverImg})`
		},
		title() {
			return this.musicList.name
		},
	},
	watch: {
		scrollY(newY) {
			let percent = Math.abs(newY / this.bgImageHeight)
			if (newY < -this.bgImageHeight) {
				this.headerTitle = this.musicList.name
			} else {
				this.headerTitle = '歌单'
			}
			if (newY < 0) {
				this.$refs.header.style.background = `rgba(211,47,47, ${percent})`
			} else {
				this.$refs.bgImage.style['paddingTop'] = PADDING_TOP + newY + 'px'
			}
		},
	},
	components: {
		Scroll,
		SongList,
		Loading,
		SlideTo,
	},
}
</script>

<style scoped lang="stylus">
@import '~common/style/variable';
@import '~common/style/mixin';

.music-list {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  background: $color-background;

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
      left: 40px;
      right: 40px;
      line-height: 44px;
      text-align: center;
      font-size: $font-size-medium-x;

      .title {
        no-wrap();
      }
    }
  }

  .list {
    fixed-page();

    .music-list-wrapper {
      .pl-header {
        position: relative;
        padding: 50px 10px 30px 15px;
        overflow: hidden;

        .bg-image {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background-size: cover;
          filter: blur(20px);
          z-index: -10;
        }

        .filter {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: -1;
          background-color: rgba(0, 0, 0, 0.25);
        }

        .plhead-wrapper {
          display: flex;

          .plhead_fl {
            flex: 0 0 126px;
            position: relative;

            img {
              width: 126px;
              height: 126px;
            }

            .gradients {
              position: absolute;
              top: 0;
              width: 100%;
              height: 18px;
              color: $color-background;
              background: linear-gradient(rgba(109, 109, 109, 0.4), rgba(255, 255, 255, 0));

              .iconfont, span {
                float: right;
                font-size: 12px;
                line-height: 18px;
                margin-right: 3px;
              }
            }
          }

          .plhead_fr {
            margin-left: 16px;
            flex: 1;
            display: flex;
            flex-direction: column;

            .pl-title {
              padding-top: 1px;
              font-size: 17px;
              line-height: 1.3;
              color: $color-background;
            }

            .avatar {
              position: relative;
              margin-top: 20px;
              display: inline-block;

              img {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                vertical-align: top;
              }

              span {
                height: 30px;
                line-height: 30px;
                color: #f2f3f4;
                font-size: $font-size-small;
              }
            }
          }
        }
      }

      .song-list-wrapper {
        position: relative;
        width: 100%;
      }
    }
  }

  .loading-container {
    position: fixed;
    width: 100%;
    top: 60%;
  }
}
</style>
