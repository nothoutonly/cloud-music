import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Radio from 'components/radio/radio'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {path: '/', redirect: '/recommend'},
    {path: '/recommend', component: Recommend},
    {path: '/radio', component: Radio}
  ]
})
