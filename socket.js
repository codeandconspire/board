const socket = require('socket.io')

module.exports = init

function init (server, state) {
  state.clients = state.clients || 0
  state.boards = state.boards || 0

  const io = socket(server)

  const board = io.of('/board')
  const client = io.of('client')

  board.on('connection', function (socket) {
    console.log('►  board connected')

    state.boards++
    board.emit('board:join')
    socket.emit('state', JSON.stringify(state))
    socket.on('reset', function () {
      socket.emit('state', JSON.stringify(state))
    })
    socket.on('disconnect', function () {
      state.boards--
      client.emit('board:leave')
      board.emit('board:leave')
      console.log('►  board disconnected')
    })
  })

  client.on('connection', function (socket) {
    console.log('►  client connected')

    socket.on('disconnect', function () {
      state.clients--
      client.emit('client:leave')
      board.emit('client:leave')
      console.log('►  client disconnected')
    })

    state.clients++
    board.emit('client:join')
    socket.on('add', function (data) {
      board.emit('add', data)
    })
    socket.on('move', function (data) {
      board.emit('move', data)
    })
    socket.on('remove', function (data) {
      board.emit('remove', data)
    })
    socket.on('save', function (data) {
      board.emit('save', data)
    })
    socket.on('new', function (data) {
      board.emit('new', data)
    })
  })
}
