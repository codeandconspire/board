const socket = require('socket.io')

module.exports = init

const state = {}

function init (server) {
  const io = socket(server)

  const board = io.of('/board')
  const client = io.of('client')

  board.on('connection', function (socket) {
    console.log('►  board connected')
    socket.emit('state', JSON.stringify(state))
    socket.on('reset', function () {
      socket.emit('state', JSON.stringify(state))
    })
  })

  client.on('connection', function (socket) {
    console.log('►  client connected')
    board.emit('join')
    socket.on('add', function (data) {
      board.emit('add', data)
    })
    socket.on('move', function (data) {
      board.emit('move', data)
    })
    socket.on('remove', function (data) {
      board.emit('remove', data)
    })
  })
}
