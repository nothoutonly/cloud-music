import Vue from 'vue'
import Router from 'vue-router'
import FM from 'components/FM/FM'
import DailyRecommend from 'components/dailyRecommend/dailyRecommend'
import RecentSong from 'components/recentSong/recentSong'
import Rank from 'components/rank/rank'
import Recommend from 'components/recommend/recommend'
import Disc from 'components/disc/disc'
import Radio from 'components/radio/radio'
import TopList from 'components/top-list/top-list'
import Search from 'components/search/search'
import Singer from 'components/singer/singer'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/recommend',
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc,
        },
      ],
    },
    {
      path: '/fm',
      component: FM,
    },
    {
      path: '/dailyRecom',
      component: DailyRecommend,
    },
    {
      path: '/recentSong',
      component: RecentSong,
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList,
        },
      ],
    },
    {
      path: '/singer',
      component: Singer,
    },
    {
      path: '/radio',
      component: Radio,
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: 'singer/:id',
          component: Singer,
        },
        {
          path: 'disc/:id',
          component: Disc,
        },
      ],
    },
  ],
})
