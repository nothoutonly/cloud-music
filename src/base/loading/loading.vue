<template>
  <div class="loading">
    <img width="40" height="40" src="./loading.gif" alt="">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
  export default {
    name: 'loading',
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    },
    data() {
      return {}
    },
    methods: {},
    computed: {},
    components: {}
  }
</script>

<style scoped lang="stylus">
  @import '~common/style/variable'
  .loading
    width: 100%
    text-align: center
    .desc
      line-height: 20px
      font-size: $font-size-small
      color: $color-text
</style>
