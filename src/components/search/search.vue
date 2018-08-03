<template>
  <slide-to>
    <div class="search">
      <div class="search-box">
        <div class="back"
             @click="back">
          <i class="iconfont icon-back"></i>
        </div>
        <div class="search-input">
          <input type="text"
                 placeholder="搜索歌单、歌手"
                 v-model="query">
          <i v-show="query"
             class="iconfont icon-delete"
             @click="clear"></i>
        </div>
      </div>
      <scroll class="search-scroll"
              :pullup="pullup"
              @scrollToEnd="searchMore"
              ref="scroll">
        <div class="scroll-wrapper">
          <div class="search-hots"
               v-show="!query">
            <p class="title">热门搜索</p>
            <span class="search-hots-item"
                  v-for="(item,index) in hots"
                  :key="index"
                  @click="addQuery(item.first)">{{item.first}}</span>
          </div>
          <!-- <div class="shortcut-wrapper"
               v-show="!query">
            <div class="search-history">
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span class="clear">
                  <i class="iconfont icon-clear"></i>
                </span>
              </h1>
              <search-list></search-list>
            </div>
          </div> -->
          <div class="search-result"
               v-show="query">
            <suggest ref="suggest"
                     :query="query"
                     @refresh="refresh"></suggest>
          </div>
        </div>
      </scroll>
      <router-view></router-view>
    </div>
  </slide-to>
</template>

<script>
import SlideTo from 'base/transition-slide/transition-slide'
import Scroll from 'base/scroll/scroll'
import SearchList from 'base/search-list/search-list'
import Suggest from 'components/suggest/suggest'

import { getSearchHot } from 'api/search'
import { playlistMixin } from 'common/js/mixin'
import { debounce } from 'common/js/util'

export default {
	mixins: [playlistMixin],
	data() {
		return {
			query: '',
			hots: [],
			pullup: true,
		}
	},
	created() {
		this._getSearchHot()
		this.$watch(
			'query',
			debounce(newQuery => {
				this.query = newQuery
			}, 300),
		)
	},
	methods: {
		back() {
			this.query = ''
			this.$router.push('/recommend')
		},
		clear() {
			this.query = ''
		},
		addQuery(key) {
			this.query = key
		},
		refresh() {
			this.$refs.scroll.refresh()
		},
		searchMore() {
			this.$refs.suggest.searchMore()
		},
		_getSearchHot() {
			getSearchHot().then(res => {
				this.hots = res.data.result.hots
			})
		},
		handlePlaylist(playlist) {
			const bottom = playlist.length > 0 ? '60px' : ''
			this.$refs.scroll.$el.style.bottom = bottom
			this.refresh()
		},
	},
	components: {
		SlideTo,
		Scroll,
		SearchList,
		Suggest,
	},
}
</script>

<style scoped lang="stylus">
@import '~common/style/variable';
@import '~common/style/mixin';

.search {
  fixed-page();

  .search-box {
    width: 100%;
    height: 44px;
    background: $color-theme;
    display: flex;

    .back {
      flex: 0 0 50px;
      height: 100%;
      text-align: center;

      .iconfont {
        line-height: 44px;
        font-size: 24px;
        color: $color-background;
      }
    }

    .search-input {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;

      input {
        width: 96%;
        height: 70%;
        outline: none;
        background: $color-theme;
        border-bottom: 1px solid $color-input-border;
        color: $color-background;

        &::placeholder {
          color: $color-input;
        }
      }

      .icon-delete {
        position: absolute;
        right: 12px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        border: none;
      }
    }
  }

  .search-scroll {
    height: 100%;
    overflow: hidden;

    .search-hots {
      margin: 0 20px;

      .title {
        padding: 10px 5px 0 5px;
        height: 30px;
        line-height: 30px;
        font-size: $font-size-medium;
        color: $color-text-g;
      }

      span {
        display: inline-block;
        padding: 3px 10px;
        margin: 4px 4px;
        border: 0.8px solid $color-text-ggg;
        border-radius: 20px;
        line-height: 20px;
        color: $color-text;
        font-size: $font-size-medium;
      }
    }

    .shortcut-wrapper {
      position: relative;
      // top: 178px
      // bottom: 0
      // width: 90%
      margin: 0 auto;

      .shortcut {
        height: 100%;
        overflow: hidden;

        .hot-key {
          margin: 0 20px 20px 20px;

          .title {
            margin-bottom: 20px;
            font-size: $font-size-medium;
            color: $color-text;
          }

          .item {
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 6px;
            background: $color-highlight-background;
            font-size: $font-size-medium;
            color: $color-text;
          }
        }
      }

      .search-history {
        position: relative;
        margin: 10px 25px;

        .title {
          display: flex;
          align-items: center;
          height: 30px;
          font-size: $font-size-small-x;
          color: $color-text-g;

          .text {
            // font-size: 13px;
            flex: 1;
          }

          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text;
            }
          }
        }
      }
    }

    .search-result {
      position: relative;
      width: 100%;
      top: 10px;
      bottom: 0;
    }
  }
}
</style>