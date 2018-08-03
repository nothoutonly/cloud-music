<template>
  <div class="song-list">
    <div class="sequence-play"
         v-show="songs.length"
         @click="sequence">
      <i class="iconfont icon-play"></i>
      <span class="text">播放全部</span>
      <span class="count">(共{{songs.length}}首)</span>
    </div>
    <ul>
      <li v-for="(song,index) in songs"
          :key="song.id"
          class="list-item"
          @click="selectItem(song, index)">
        <span class="count">{{index+1}}</span>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
	name: 'song-list',
	props: {
		songs: {
			type: Array,
			default: [],
		},
	},
	data() {
		return {}
	},
	methods: {
		sequence() {
			this.$emit('sequence')
		},
		selectItem(song, index) {
			this.$emit('select', song, index)
		},
		getDesc(song) {
			if (!song.album) {
				return song.singer
			} else {
				return `${song.singer} - ${song.album}`
			}
		},
	},
	computed: {},
	components: {},
}
</script>

<style scoped lang="stylus">
@import '~common/style/variable';
@import '~common/style/mixin';

.song-list {
  position: relative;
  top: -10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: $color-background;

  .sequence-play {
    display: flex;
    height: 40px;
    border-bottom: 1px solid $color-border;

    .iconfont {
      flex: 0 0 50px;
      font-size: 24px;
      line-height: 40px;
      text-align: center;
    }

    .text {
      line-height: 40px;
      font-size: $font-size-medium-x;
      color: $color-text;
    }

    .count {
      line-height: 40px;
      font-size: $font-size-medium;
      color: $color-text-sub;
    }
  }

  .list-item {
    display: flex;
    align-items: center;
    height: 60px;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    border-bottom: 1px solid $color-border;

    .count {
      flex: 0 0 50px;
      text-align: center;
      font-size: $font-size-medium-x;
      color: $color-text;
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding-right: 30px;

      .name {
        color: $color-text;
        font-size: $font-size-medium-x;
        line-height: 1.5;
        no-wrap();
      }

      .desc {
        color: $color-text-sub;
        font-size: $font-size-medium;
        no-wrap();
      }
    }
  }
}
</style>
