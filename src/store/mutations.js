import * as types from './mutations-types'

const mutations = {
  [types.SET_MUSIC_LIST](state, musicList) {
    state.musicList = musicList
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_CURRENT_INDEX](state, index) {
    console.log(index)

    state.currentIndex = index
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_TOP_LIST](state, topList) {
    state.topList = topList
  },
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
}

export default mutations
