const io = require('socket.io-client')
const Counter = require('./counter')
const Sticker = require('./sticker')

const socket = io(`/board`)
const state = {
  users: 0,
  stickers: {
    temp: [],
    saved: []
  }
}

const counter = new Counter()
document.body.appendChild(counter.render())
socket.on('join', function () {
  state.users += 1
  counter.render(state.users)
})

socket.on('add', function (data) {
  const sticker = new Sticker('sticker-' + data.id)
  state.stickers.temp.push(Object.assign({sticker}, data))
  document.body.appendChild(sticker.render(data))
})

socket.on('move', function (data) {
  const sticker = state.stickers.temp.find(sticker => sticker.id === data.id)
  if (!sticker) return
  sticker.sticker.render(data)
})

socket.on('remove', function (data) {
  const sticker = document.getElementById(`sticker-${data.id}`)
  if (!sticker) return
  state.stickers.temp = state.stickers.temp.filter(sticker => sticker.id !== data.id)
  sticker.parentNode.removeChild(sticker)
})

socket.on('save', function (data) {
  const sticker = state.stickers.temp.find(sticker => sticker.id === data.id)
  state.stickers.temp = state.stickers.temp.filter(sticker => sticker.id !== data.id)
  state.stickers.saved.push(sticker)
  console.log(state.stickers)
  console.log(sticker)
  sticker.sticker.render({ saved: true })
})
