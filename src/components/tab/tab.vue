<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span>个性推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/radio">
      <span>主播电台</span>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'tab',
    data() {
      return {}
    },
    methods: {},
    computed: {},
    components: {}
  }
</script>

<style scoped lang="stylus">
  @import "~common/style/variable.styl";
  .tab
    display: flex
    line-height: 44px
    height: 44px
    width: 100%
    font-size: $font-size-medium
    background: $color-theme
    .tab-item
      flex: 1
      text-align: center
      color: $color-background
      span
        padding-bottom: 3px
      &.active
        span
          font-weight: bold
          color: $color-text-l
          border-bottom: 3px solid $color-background
</style>
