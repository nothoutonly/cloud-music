<template>
  <div class="m-header">
    <router-link to="/user" class="mine" tag="div">
      <i class="iconfont icon-account"></i>
    </router-link>
    <input class="input" type="text">
    <router-link to="/search" class="search" tag="div">
      <i class="iconfont icon-pulse"></i>
    </router-link>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="stylus" scoped>
  @import "~common/style/variable";

  .m-header
    display: flex
    justify-content: center
    align-items: center
    position: relative
    height: 44px
    width: 100%
    text-align: center
    background: $color-theme
    .input
      display: flex
      height: 30px
      border-radius: 15px
      flex: auto
      font-weight: bold
      font-size: 20px
      background-color: $color-input-bg
    .mine, .search
      flex: 0, 0, 80px
      .iconfont
        display: block
        padding: 12px
        line-height: 48px
        font-size: $font-size-large
        color: $color-background

</style>
