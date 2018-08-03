<template>
  <div class="player"
       v-show="playlist.length > 0">
    <transition name="normal">
      <div class="normal-player"
           v-show="fullScreen">
        <div class="background">
          <div class="filter"></div>
          <img :src="currentSong.image"
               alt=""
               width="100%"
               height="100%">
        </div>
        <div class="top">
          <div class="back"
               @click="back">
            <i class="iconfont icon-back"></i>
          </div>
          <h1 class="title"
              v-html="currentSong.name"></h1>
          <h2 class="subtitle"
              v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @click="changeMiddle">
          <transition name="middleL">
            <div class="middle-l"
                 v-show="middleShow==='cd'">
              <div class="cd-wrapper">
                <div class="cd"
                     :class="cdRotate">
                  <img :src="currentSong.image"
                       class="image"
                       alt="">
                </div>
              </div>
            </div>
          </transition>
          <transition name="middleR">
            <scroll class="middle-r"
                    ref="lyricList"
                    :data="currentLyric && currentLyric.lines"
                    v-show="middleShow==='lyric'">
              <div class="lyric-wrapper">
                <div v-if="currentLyric">
                  <p class="text"
                     :class="{'current': currentLineNum===index}"
                     ref="lyricLine"
                     v-for="(line,index) in currentLyric.lines"
                     :key="index">{{line.txt}}</p>
                </div>
                <p class="no-lyric"
                   v-if="!currentLyric">{{updateCurrentLyric}}</p>
              </div>
            </scroll>
          </transition>

        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time timer-l">{{formatTime(this.currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent"
                            @percentChange="percentChange" />
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="iconfont"
                 :class="iconMode"
                 @click="changeMode"></i>
            </div>
            <div class="icon i-left"
                 :class="disableCls">
              <i class="iconfont icon-triangle-prev"
                 @click="prev"></i>
            </div>
            <div class="icon i-center"
                 :class="disableCls">
              <i class="iconfont"
                 :class="playIcon"
                 @click="togglePlaying"></i>
            </div>
            <div class="icon i-right"
                 :class="disableCls">
              <i class="iconfont icon-triangle-next"
                 @click="next"></i>
            </div>
            <div class="icon i-right"
                 @click="showPlaylist">
              <i class="iconfont icon-songlist"></i>
            </div>
          </div>
        </div>

      </div>
    </transition>

    <transition name="mini">
      <div class="mini-player"
           v-show="!fullScreen"
           @click.stop="open">
        <div class="icon"
             :class="cdRotate">
          <img :src="currentSong.image"
               alt=""
               width="40px"
               height="40px">
        </div>
        <div class="text">
          <h2 class="name"
              v-html="currentSong.name"></h2>
          <p class="desc"
             v-html="currentSong.singer"></p>
        </div>
        <div class="control"
             @click.stop="togglePlaying">
          <progress-circle :radius="radius"
                           :percent="percent">
            <i class="iconfont icon-mini"
               :class="playIcon"></i>
          </progress-circle>
        </div>
        <div class="control"
             @click="showPlaylist">
          <i class="iconfont icon-songlist"></i>
        </div>
      </div>
    </transition>

    <play-list ref="playlist"
               @stopMusic="stopMusic"></play-list>

    <audio autoplay
           ref="audio"
           :src="audioUrl"
           @canplay="ready"
           @ended="ended"
           @error="error"
           @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import Scroll from 'base/scroll/scroll'
import PlayList from 'components/playlist/playlist'

import { mapGetters, mapMutations } from 'vuex'
import { getSong, getLyric } from 'api/song'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import Lyric from 'lyric-parser'

export default {
	name: 'player',
	data() {
		return {
			audioUrl: '',
			songReady: false,
			currentTime: 0,
			radius: 32,
			currentLyric: null,
			currentLineNum: 0,
			noLyric: false,
			middleShow: 'cd',
		}
	},
	created() {},
	methods: {
		changeMiddle() {
			if (this.middleShow === 'cd') {
				this.middleShow = 'lyric'
			} else {
				this.middleShow = 'cd'
			}
		},
		showPlaylist() {
			this.$refs.playlist.show()
		},
		stopMusic() {
			this.$refs.audio.pause()
		},
		back() {
			this.setFullScreen(false)
			this.middleShow = 'cd'
		},
		open() {
			this.setFullScreen(true)
		},
		togglePlaying() {
			const audio = this.$refs.audio
			this.setPlayingState(!this.playing)
			this.playing ? audio.play() : audio.pause()
			if (this.currentLyric) {
				this.currentLyric.togglePlay()
			}
		},
		changeMode() {
			const mode = (this.mode + 1) % 3
			this.setPlayMode(mode)
			let list = null
			if (mode === playMode.random) {
				list = shuffle(this.sequenceList)
			} else {
				list = this.sequenceList
			}
			this.resetCurrentIndex(list)
			this.setPlaylist(list)
		},
		resetCurrentIndex(list) {
			let index = list.findIndex(item => this.currentSong.id === item.id)
			this.setCurrentIndex(index)
		},
		next() {
			if (!this.songReady) return
			// 处理playlist.length===1的边界情况
			if (this.playlist.length === 1) {
				this.loop()
			} else {
				let index = this.currentIndex + 1
				if (index === this.playlist.length) {
					index = 0
				}
				this.setCurrentIndex(index)
				if (!this.playing) {
					this.togglePlaying()
				}
			}
			this.songReady = false
		},
		prev() {
			if (!this.songReady) return
			if (this.playlist.length === 1) {
				this.loop()
			} else {
				let index = this.currentIndex - 1
				if (index === -1) {
					index = this.playlist.length - 1
				}
				this.setCurrentIndex(index)
				if (!this.playing) {
					this.togglePlaying()
				}
			}
			this.songReady = false
		},
		loop() {
			this.$refs.audio.currentTime = 0
			this.$refs.audio.play()
			if (this.currentLyric) {
				this.currentLyric.seek(0)
			}
		},
		ready() {
			this.songReady = true
		},
		ended() {
			this.mode === playMode.loop ? this.loop() : this.next()
		},
		error() {
			this.songReady = true
		},
		updateTime(e) {
			this.currentTime = e.target.currentTime
		},
		formatTime(val) {
			val = val | 0
			let minute = this._pad((val / 60) | 0)
			let second = this._pad(val % 60)
			return `${minute}:${second}`
		},
		percentChange(percent) {
			let currentTime = this.currentSong.duration * percent
			this.$refs.audio.currentTime = currentTime
			if (!this.playing) {
				this.togglePlaying()
			}
			if (this.currentLyric) {
				this.currentLyric.seek(currentTime * 1000)
			}
		},
		_getSong(id) {
			getSong(id).then(res => {
				this.audioUrl = res.data.data[0].url
			})
		},
		_getLyric(id) {
			if (this.currentLyric) {
				this.currentLyric.stop()
				this.currentLyric = null
			}
			this.noLyric = false
			getLyric(id)
				.then(res => {
					this.currentLyric = new Lyric(res.data.lrc.lyric, this.handleLyric)
					if (this.playing) {
						this.currentLyric.play()
						this.currentLineNum = 0
					}
				})
				.catch(() => {
					this.currentLyric = null
					this.noLyric = true
					this.currentLineNum = 0
				})
		},
		handleLyric({ lineNum, txt }) {
			this.currentLineNum = lineNum
			if (lineNum > 5) {
				let lineEl = this.$refs.lyricLine[lineNum - 5]
				this.$refs.lyricList.scrollToElement(lineEl, 1000)
			} else {
				this.$refs.lyricList.scrollTo(0, 0, 1000)
			}
		},
		_pad(num, n = 2) {
			let len = num.toString().length
			while (len < n) {
				num = '0' + num
				len++
			}
			return num
		},
		...mapMutations({
			setFullScreen: 'SET_FULL_SCREEN',
			setPlayingState: 'SET_PLAYING_STATE',
			setCurrentIndex: 'SET_CURRENT_INDEX',
			setPlayMode: 'SET_PLAY_MODE',
			setPlaylist: 'SET_PLAYLIST',
		}),
	},
	computed: {
		playIcon() {
			return this.playing ? 'icon-pause' : 'icon-play'
		},
		iconMode() {
			return this.mode === playMode.sequence
				? 'icon-sequence'
				: this.mode === playMode.loop
					? 'icon-loop'
					: 'icon-random'
		},
		cdRotate() {
			return this.playing ? 'play' : 'play pause'
		},
		disableCls() {
			return this.songReady ? '' : 'disable'
		},
		percent() {
			// console.log(this.$refs.audio.duration)

			return this.currentTime / this.currentSong.duration
		},
		updateCurrentLyric() {
			if (this.noLyric) {
				return '暂无歌词'
			} else {
				return '歌词加载中...'
			}
		},
		...mapGetters([
			'playlist',
			'fullScreen',
			'currentSong',
			'playing',
			'currentIndex',
			'mode',
			'sequenceList',
		]),
	},
	watch: {
		currentSong(newVal, oldVal) {
			if (!newVal.id) return
			if (newVal.id === oldVal.id) return
			this.$refs.audio.pause()
			this.$refs.audio.currentTime = 0
			this._getSong(newVal.id)
			this._getLyric(newVal.id)
		},
		audioUrl() {},
	},
	components: {
		ProgressBar,
		ProgressCircle,
		Scroll,
		PlayList,
	},
}
</script>

<style scoped lang="stylus">
@import '~common/style/variable';
@import '~common/style/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;
    }

    .background {
      position: absolute;
      left: -50%;
      top: -50%;
      width: 300%;
      height: 300%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(30px);

      .filter {
        position: absolute;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.6;
      }

      .filterR {
        position: absolute;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.4;

        &.filterR-enter-active, &.filterR-leave-active {
          transition: all 0.3s;
        }

        &.filterR-leave-to, &.filterR-enter {
          opacity: 0;
        }

        &.filterR-leave {
          opacity: 0.4;
        }
      }
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 6px;
        left: 6px;
        z-index: 50;

        .iconfont {
          display: block;
          padding: 5px 9px;
          font-size: 35px;
          color: $color-icon;
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        padding-top: 10px;
        line-height: 20px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        font-weight: bold;
        color: $color-background;
      }

      .subtitle {
        width: 70%;
        margin: 0 auto;
        line-height: 20px;
        text-align: center;
        no-wrap();
        font-size: $font-size-small-x;
        color: $color-background;
      }
    }

    .middle {
      display: flex;
      align-items: center;
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        &.middleL-enter-active, &.middleL-leave-active {
          transition: all 0.2s;
        }

        &.middleL-enter, &.middleL-leave-to {
          opacity: 0;
        }

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 15px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: relative;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
      }

      .middle-r {
        display: inline-block;
        position: absolute;
        top: 0;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        &.middleR-enter-active, &.middleR-leave-active {
          transition: all 0.2s;
        }

        &.middleR-enter, &.middleR-leave-to {
          opacity: 0;
        }

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 40px;
            color: $color-text-ggg;
            font-size: $font-size-medium;

            &.current {
              color: $color-background;
              font-size: $font-size-medium-x;
            }
          }

          .no-lyric {
            line-height: 40px;
            margin-top: 60%;
            color: $color-text-ggg;
            font-size: $font-size-medium;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-background;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
            color: $color-text-gg;
          }
        }

        .progress-bar-wrapper {
          padding: 0 5px;
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-background;

          &.disable {
            color: $color-text-ggg;
          }

          i {
            font-size: 30px;
          }

          .mode {
            font-size: 25px;
          }

          &.i-left {
            text-align: right;
          }

          &.i-center {
            padding: 0 20px;
            text-align: center;

            i {
              font-size: 40px;
            }
          }

          &.i-right {
            text-align: left;
          }

          .icon-like {
            color: $color-theme;
          }

          .icon-favorites {
            font-size: 24px;
          }
        }
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: rgba(255, 255, 255, 0.85);

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      &.play {
        animation: rotate 10s linear infinite;
      }

      &.pause {
        animation-play-state: paused;
      }

      img {
        border-radius: 50%;
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        line-height: 14px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .iconfont {
        font-size: 30px;
        color: $color-text;

        &.icon-mini {
          position: absolute;
          top: 3px;
          left: 0;
          z-index: -1;
          font-size: 32px;
          color: $color-text;
        }
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
