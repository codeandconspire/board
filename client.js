const Draggable = require('@shopify/draggable')
const io = require('socket.io-client')

const socket = io(`/client`)
const board = document.querySelector('.board')
const containers = document.querySelectorAll('.dropzone')
let width = board.clientWidth
let height = board.clientHeight
let dragid = null

const sticker = new Draggable.Draggable(containers, {
  draggable: '.item',
  delay: 0
})

sticker.on('drag:start', function (event) {
  dragid = (new Date() % 9e6).toString(36)
  socket.emit('add', {
    id: dragid,
    image: event.data.originalSource.id,
    x: (event.data.sensorEvent.data.clientX / width * 100).toFixed(6),
    y: (event.data.sensorEvent.data.clientY / height * 100).toFixed(6)
  })
})

sticker.on('drag:move', function (event) {
  if (event.data.sensorEvent.data.target.isSameNode(board)) {
    socket.emit('move', {
      id: dragid,
      image: event.data.originalSource.id,
      x: (event.data.sensorEvent.data.clientX / width * 100).toFixed(6),
      y: (event.data.sensorEvent.data.clientY / height * 100).toFixed(6)
    })
  }
})
