const io = require('socket.io-client')
const Counter = require('./counter')
const Sticker = require('./sticker')

const socket = io(`/board`)
const state = {
  users: 0,
  stickers: []
}

const counter = new Counter()
document.body.appendChild(counter.render())
socket.on('join', function () {
  state.users += 1
  counter.render(state.users)
})

socket.on('add', function (data) {
  const sticker = new Sticker('sticker-' + data.id)
  state.stickers.push(Object.assign({sticker}, data))
  document.body.appendChild(sticker.render(data))
})

socket.on('move', function (data) {
  const item = state.stickers.find(item => item.id === data.id)
  if (!item) return
  item.sticker.render(data)
})
