import * as types from './mutations-types'
import { playMode } from 'common/js/config'
import { shuffle } from '../common/js/util'

function findIndex(list, song) {
  return list.findIndex(item => {
    return song.id === item.id
  })
}

export const sequencePlay = function({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.sequence)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const selectPlay = function({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function({ commit, state }, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有插入的歌曲，并返回索引
  let findPlaylistIndex = findIndex(playlist, song)
  // 插入歌曲，索引+1
  currentIndex++
  // 插入歌曲
  playlist.splice(currentIndex, 0, song)
  if (findPlaylistIndex > -1) {
    if (currentIndex > findPlaylistIndex) {
      // 如果当前插入的序号大于列表中的序号
      playlist.splice(findPlaylistIndex, 1)
      currentIndex--
    } else {
      playlist.splice(findPlaylistIndex + 1, 1)
    }
  }

  let currentSeqIndex = findIndex(sequenceList, currentSong)
  let findSeqIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSeqIndex, 0, song)
  if (findSeqIndex > -1) {
    if (currentSeqIndex > findSeqIndex) {
      sequenceList.splice(findSeqIndex, 1)
    } else {
      sequenceList.splice(findSeqIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const deleteSong = function({ commit, state }, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

export const deleteSongList = function({ commit }) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}
