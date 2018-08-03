<template>
  <div class="index-header">
    <router-link to="/user"
                 class="mine"
                 tag="div">
      <i class="iconfont icon-account"></i>
    </router-link>
    <router-link to="/search"
                 tag="div"
                 class="input">
      <input type="text">
    </router-link>
    <router-link to="/search"
                 class="search"
                 tag="div">
      <i class="iconfont icon-pulse"></i>
    </router-link>
  </div>
</template>

<script>
export default {}
</script>

<style lang="stylus" scoped>
@import '~common/style/variable';

.index-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  width: 100%;
  background: $color-theme;

  .input {
    flex: 1;

    input {
      width: 100%;
      height: 30px;
      border-radius: 15px;
      font-weight: bold;
      background-color: $color-input-bg;
    }
  }

  .mine, .search {
    flex: 0 0 50px;

    .iconfont {
      padding: 12px;
      line-height: 48px;
      font-size: $font-size-large;
      color: $color-background;
    }
  }
}
</style>
