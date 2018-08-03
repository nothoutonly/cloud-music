export default class Song {
  constructor({ id, singer, name, album, duration, image, url, aliaName }) {
    this.id = id
    this.singer = singer
    this.name = name
    this.album = album
    this.aliaName = aliaName
    this.image = image
    this.duration = duration / 1000
  }
}

function singerName(arr) {
  let name = []
  name = arr.map(item => {
    return item.name
  })

  return name.join('/')
}

export function createRecommendSong(music) {
  return new Song({
    id: music.id,
    singer: singerName(music.song.artists),
    name: music.name,
    aliaName: music.song.alias.join(' - '),
    album: music.song.album.name,
    image: music.song.album.picUrl,
    duration: music.duration,
  })
}

export function createRecommendListSong(music) {
  return new Song({
    id: music.id,
    singer: singerName(music.artists),
    name: music.name,
    aliaName: music.album.alias.join(' - '),
    album: music.album.name,
    image: music.album.picUrl,
    duration: music.duration,
  })
}

export function createSearchSong(music) {
  return new Song({
    id: music.id,
    singer: singerName(music.artists),
    name: music.name,
    album: music.album.name,
    duration: music.dt / 1000,
  })
}

export function getSingerHotSong(song) {
  return new Song({
    id: song.id,
    singer: singerName(song.ar),
    name: song.name,
    aliname: song.alia.join(' - '),
    album: song.al.name,
    image: song.al.picUrl,
    duration: song.dt / 1000,
  })
}
