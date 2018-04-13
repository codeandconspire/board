const io = require('socket.io-client')
const Counter = require('./counter')
const Sticker = require('./sticker')

const socket = io(`/board`)
const state = Object.assign({
  clients: 0,
  stickers: {
    temp: [],
    saved: []
  }
}, window.initialState)
const counter = new Counter('Peeps online')
document.body.appendChild(counter.render(state.clients))
socket.on('client:join', function () {
  state.clients += 1
  counter.render(state.clients)
})
socket.on('client:leave', function () {
  state.clients -= 1
  counter.render(state.clients)
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
  sticker.sticker.render({ saved: true })
})
