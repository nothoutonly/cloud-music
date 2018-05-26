<template>
  <div class="song-list">
    <div class="sequence-play" v-show="songs.length" @click="sequence">
      <i class="iconfont icon-play"></i>
      <span class="text">播放全部</span>
      <span class="count">(共{{songs.length}}首)</span>
    </div>
    <ul>
      <li v-for="(song,index) in songs" :key="song.id" class="item" @click="selectItem(song, index)">
        <span class="count">{{index+1}}</span>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{song.singer}} - {{song.album}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    name: 'song-list',
    props: {
      songs: {
        type: Array,
        default: []
      },
    },
    data() {
      return {}
    },
    methods: {
      sequence() {
        this.sequencePlay({
          list: this.songs
        })
      },
      ...mapActions([
        'sequencePlay'
      ])
    },
    computed: {},
    components: {}
  }
</script>

<style scoped lang="stylus">
  @import "~common/style/variable"

  .song-list
    position: relative
    top: -10px
    border-top-left-radius: 10px
    border-top-right-radius: 10px
    background-color: $color-background
    .sequence-play
      display: flex
      height: 40px
      border-bottom: 1px solid #e4e4e4
      .iconfont
        flex: 0 0 60px
        font-size: 28px
        line-height: 40px
        text-align: center
      .text
        line-height: 40px
        font-size: $font-size-medium-x
        color: $color-text
      .count
        line-height: 40px
        font-size: $font-size-medium
        color: $color-text-sub

</style>
