import Vue from 'vue'
import Router from 'vue-router'
// import FM from 'components/FM/FM'
// import DailyRecommend from 'components/dailyRecommend/dailyRecommend'
// import SongCollection from 'components/songCollection/songCollection'
// import Rank from 'components/rank/rank'
import Recommend from 'components/recommend/recommend'
import MusicList from 'components/music-list/music-list'
import Radio from 'components/radio/radio'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: MusicList
        }
      ]
    },
    // {
    //   path: '/fm',
    //   component: FM
    // },
    // {
    //   path: '/dailyRecom',
    //   component: DailyRecommend
    // },
    // {
    //   path: '/songCollection',
    //   component: SongCollection
    // },
    // {
    //   path: '/rank',
    //   component: Rank
    // },
    {
      path: '/radio',
      component: Radio
    }
  ]
})
