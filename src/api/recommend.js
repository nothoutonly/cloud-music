import axios from 'axios'
import { HOST } from 'common/js/config'

const instance = axios.create({
  baseURL: HOST,
  timeout: 20000,
  validateStatus: function(status) {
    return status < 500
  },
  headers: {
    // 跨域请求 这个配置不能少
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    Accept: 'application/json',
  },
  xhrFields: { withCredentials: true },
})
export function getBanner() {
  const url = '/banner'
  return instance.get(url)
}

export function getRecommendList() {
  const url = '/personalized'
  return instance.get(url)
}

export function getRecommendMusic() {
  const url = '/personalized/newsong'
  return instance.get(url)
}

export function getRecommendListDetail(id) {
  const url = `/playlist/detail?id=${id}`
  return instance.get(url)
}
