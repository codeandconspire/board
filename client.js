const Draggable = require('@shopify/draggable')
const io = require('socket.io-client')

const socket = io(`/client`)
const pad = document.querySelector('.js-pad')
const inventory = document.querySelector('.js-inventory')
let width = pad.clientWidth
let height = pad.clientHeight
let dragid = null

// disable pinch to zoom in ios 10
document.addEventListener('gesturestart', function (e) {
  e.preventDefault()
})

const sticker = new Draggable.Draggable(inventory, {
  draggable: '.js-sticker',
  delay: 0,
  classes: {
    'body:dragging': 'is-dragging',
    'container:dragging': 'is-dragging',
    'source:dragging': 'is-draggingSource',
    'source:placed': 'is-placedSource',
    'container:placed': 'is-placed',
    'draggable:over': 'is-draggingOver',
    'container:over': 'is-draggingOver',
    'source:original': 'is-original',
    'mirror': 'is-mirror'
  }
})

sticker.on('drag:out:container', function (event) {
  dragid = (new Date() % 9e6).toString(36)
  socket.emit('add', {
    id: dragid,
    image: event.data.originalSource.id,
    x: (event.data.sensorEvent.data.clientX / width * 100).toFixed(6),
    y: (event.data.sensorEvent.data.clientY / height * 100).toFixed(6)
  })
})

sticker.on('drag:move', function (event) {
  const target = event.data.sensorEvent.data.target
  if (target && target.isSameNode(pad)) {
    socket.emit('move', {
      id: dragid,
      image: event.data.originalSource.id,
      x: (event.data.sensorEvent.data.clientX / width * 100).toFixed(6),
      y: (event.data.sensorEvent.data.clientY / height * 100).toFixed(6)
    })
  }
})

sticker.on('drag:over:container', function (event) {
  if (dragid) {
    socket.emit('remove', { id: dragid })
    dragid = null
  }
})

sticker.on('drag:stop', function (event) {
  if (dragid) {
    socket.emit('save', { id: dragid })
    dragid = null
  }
})
