import { playMode } from 'common/js/config'

const state = {
  musicList: {},
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  topList: {},
}
export default state
