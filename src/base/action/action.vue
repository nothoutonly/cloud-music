<template>
  <div class="actions">
    <router-link tag="div" class="tab-item" to="/recommend">
      <div class="action">
        <div class="iconborder">
          <i class="iconfont icon-FM"></i>
        </div>
        <span>私人FM</span>
      </div>
    </router-link>
    <router-link tag="div" class="tab-item" to="/radio">
      <div class="action">
        <div class="iconborder">
          <i class="iconfont icon-meirituijian"></i>
        </div>
        <span>每日推荐</span>
      </div>
    </router-link>
    <router-link tag="div" class="tab-item" to="/radio">
      <div class="action">
        <div class="iconborder">
          <i class="iconfont icon-gedan"></i>
        </div>
        <span>歌单</span>
      </div>
    </router-link>
    <router-link tag="div" class="tab-item" to="/radio">
      <div class="action">
        <div class="iconborder">
          <i class="iconfont icon-paihang"></i>
        </div>
        <span>排行榜</span>
      </div>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'action',
    data() {
      return {}
    },
    methods: {},
    computed: {},
    components: {}
  }
</script>

<style scoped lang="stylus">
  @import "~common/style/variable.styl"
  @import "~common/style/mixin"
  .actions
    display: flex
    height: 100px
    width: 100%
    font-size: $font-size-medium
    background: $color-background
    border-bottom: 1px solid #ccc
    .tab-item
      flex: 1
      text-align: center
      color: $color-background
      .action
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        height: 100%
        .iconborder
          box-sizing: border-box
          display: flex
          align-items: center
          justify-content: center
          color: $color-theme
          width: 50px
          height: 50px
          border: 1px solid $color-theme
          border-radius: 50%
          .iconfont
            width: 24px
            height: 24px
            font-size: 24px
        span
          line-height: 30px
          color: $color-text
          font-size: $font-size-small
</style>
