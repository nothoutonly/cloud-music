<template>
  <transition name="list-fade">
    <div class="playlist"
         v-show="showFlag"
         @click="hide">
      <div class="list-wrapper"
           @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="iconfont"
               :class="iconMode"
               @click="changeMode"></i>
            <span class="text">{{modeText}}
              <span class="count">({{playlist.length}})</span>
            </span>
            <span class="clear"
                  @click="showConfirm">
              <i class="iconfont icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="listContent"
                class="list-content"
                :data="sequenceList">
          <transition-group name="list"
                            tag="ul">
            <li class="item"
                ref="listItem"
                @click="selectItem(item, index)"
                v-for="(item,index) in sequenceList"
                :key="item.id">
              <i class="current iconfont"
                 :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}
                <span class="singer">-{{item.singer}}</span>
              </span>
              <span class="delete"
                    @click="deleteOne(item)">
                <i class="iconfont icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div @click="hide"
             class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm"
               @confirm="confirmClear"
               text="是否清空播放列表"
               confirmBtnText="清空"></confirm>
    </div>
  </transition>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

export default {
	data() {
		return {
			showFlag: false,
		}
	},
	methods: {
		showConfirm() {
			this.$refs.confirm.show()
		},
		hide() {
			this.showFlag = false
		},
		show() {
			this.showFlag = true
			setTimeout(() => {
				this.$refs.listContent.refresh()
				this.scrollToCurrent(this.currentSong)
			}, 20)
		},
		scrollToCurrent(current) {
			const index = this.sequenceList.findIndex(song => {
				return current.id === song.id
			})
			this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
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
			let index = list.findIndex(item => {
				return item.id === this.currentSong.id
			})
			this.setCurrentIndex(index)
			this.setPlaylist(list)
		},
		selectItem(item, index) {
			if (this.mode === playMode.random) {
				index = this.playlist.findIndex(song => {
					return song.id === item.id
				})
			}
			this.setCurrentIndex(index)
		},
		deleteOne(item) {
			this.deleteSong(item)
			if (!this.playlist.length) {
				this.hide()
				this.$emit('stopMusic')
			}
		},
		getCurrentIcon(item) {
			if (this.currentSong.id === item.id) {
				return 'icon-volume'
			}
			return ''
		},
		confirmClear() {
			this.deleteSongList()
			this.hide()
			this.$emit('stopMusic')
		},
		...mapMutations({
			setFullScreen: 'SET_FULL_SCREEN',
			setPlayingState: 'SET_PLAYING_STATE',
			setCurrentIndex: 'SET_CURRENT_INDEX',
			setPlayMode: 'SET_PLAY_MODE',
			setPlaylist: 'SET_PLAYLIST',
		}),
		...mapActions(['deleteSong', 'deleteSongList']),
	},
	computed: {
		modeText() {
			return this.mode === playMode.sequence
				? '顺序播放'
				: this.mode === playMode.random
					? '随机播放'
					: '单曲循环'
		},
		iconMode() {
			return this.mode === playMode.sequence
				? 'icon-sequence'
				: this.mode === playMode.loop
					? 'icon-loop'
					: 'icon-random'
		},

		...mapGetters([
			'fullScreen',
			'playlist',
			'currentSong',
			'playing',
			'currentIndex',
			'mode',
			'sequenceList',
		]),
	},
	components: {
		Scroll,
		Confirm,
	},
}
</script>

<style scoped lang="stylus">
@import '~common/style/variable';
@import '~common/style/mixin';

.playlist {
  fixed-page();
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 200;

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-radius: 8px;
    background-color: $color-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .iconfont {
          font-size: 20px;
          color: $color-text-g;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium-x;
          color: $color-text;

          .count {
            position: relative;
            top: 1px;
          }
        }

        .clear {
          extend-click();

          .icon-clear {
            font-size: $font-size-medium-x;
            color: $color-text-g;
          }
        }
      }
    }

    .list-content {
      max-height: 280px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        &.list-enter-active, &.list-leave-active {
          transition: all 0.1s;
        }

        &.list-enter, &.list-leave-to {
          height: 0;
        }

        .current {
          color: $color-theme;
          margin-right: 5px;
        }

        .text {
          flex: 1;
          no-wrap();
          line-height: 20px;
          font-size: $font-size-medium-x;
          color: $color-text;

          .singer {
            font-size: $font-size-small-s;
            color: $color-text-sub;
          }
        }

        .delete {
          extend-click();
          font-size: $font-size-small-s;
          color: $color-text;
        }
      }
    }

    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text;
    }
  }
}
</style>