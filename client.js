const Draggable = require('@shopify/draggable')
const io = require('socket.io-client')
const socket = io(`/client`)
const html = require('nanohtml')

const pad = document.querySelector('.js-pad')
const inventory = document.querySelector('.js-inventory')
const file = document.querySelector('.js-file')
const form = document.querySelector('.js-form')

let width = pad.clientWidth
let height = pad.clientHeight
let dragid = null

// disable pinch to zoom in ios 10
document.addEventListener('gesturestart', function (e) {
  e.preventDefault()
})

file.addEventListener('change', function (e) {
  form.classList.add('is-loading')
  upload(form)
})

function upload (form) {
  const xhr = new window.XMLHttpRequest()
  xhr.onload = success
  xhr.open('post', 'https://api.cloudinary.com/v1_1/dykmd8idd/image/upload')
  xhr.send(new window.FormData(form))
}

function success () {
  const response = JSON.parse(this.responseText)
  const src = `https://res.cloudinary.com/dykmd8idd/image/upload/c_scale,q_auto:eco,w_600/${response.public_id}.${response.format}`
  const id = (new Date() % 9e6).toString(36)

  socket.emit('new', { src: src })

  const item = html`
    <div class="Inventory-sticker js-sticker" id="${id}" data-size="3">
      <img draggable="false" class="Sticker" src="${src}" />
    </div>
  `

  setTimeout(function () {
    form.parentNode.insertBefore(item, form.nextSibling)
    form.classList.remove('is-loading')
  }, 1000)
}

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
  const element = document.getElementById(event.data.originalSource.id)
  dragid = (new Date() % 9e6).toString(36)
  socket.emit('add', {
    id: dragid,
    image: element.firstElementChild.src,
    size: element.dataset.size,
    x: (event.data.sensorEvent.data.clientX / width * 100).toFixed(6),
    y: (event.data.sensorEvent.data.clientY / height * 100).toFixed(6)
  })
})

sticker.on('drag:move', function (event) {
  const target = event.data.sensorEvent.data.target
  if (target && target.isSameNode(pad)) {
    socket.emit('move', {
      id: dragid,
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
    inventory.style.left = ''
    inventory.classList.remove('is-static')
    socket.emit('save', { id: dragid })
    dragid = null
  }
})

sticker.on('drag:start', function (event) {
  if (dragid) {
    inventory.style.left = `${inventory.scrollLeft * -1}px`
    inventory.classList.add('is-static')
    socket.emit('save', { id: dragid })
    dragid = null
  }
})
