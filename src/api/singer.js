import axios from 'axios'
import { HOST } from 'common/js/config'

export function getSingerDetail(singerId) {
  const url = HOST + `/artists?id=${singerId}`
  return axios.get(url)
}
