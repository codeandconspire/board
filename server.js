const fs = require('fs')
const path = require('path')
const http = require('http')
const tinyify = require('tinyify')
const socket = require('./socket')
const browserify = require('browserify')
const hyperstream = require('hyperstream')
const incremental = require('browserify-incremental')

const board = browserify(incremental.args)
board.add(path.join(__dirname, '/board.js'))
if (process.env.NODE_ENV !== 'development') board.plugin(tinyify)
incremental(board)

const client = browserify(incremental.args)
client.add(path.join(__dirname, '/client.js'))
if (process.env.NODE_ENV !== 'development') client.plugin(tinyify)
incremental(client)

const state = {
  clients: 0,
  boards: 0
}

const server = http.createServer(function (req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')

  switch (req.url) {
    case '/': {
      fs.createReadStream('./client.html').pipe(document(state)).pipe(res)
      break
    }
    case '/board': {
      fs.createReadStream('./board.html').pipe(document(state)).pipe(res)
      break
    }
    default: {
      res.statusCode = 404
      fs.createReadStream('./404.html').pipe(document(state)).pipe(res)
    }
  }
})

socket(server, state)

server.listen(process.env.PORT || 8080, function () {
  console.info(`☞  http://localhost:${process.env.PORT || 8080}`)
})

function document (state) {
  return hyperstream({
    '#board-bundle': board.bundle(),
    '#client-bundle': client.bundle(),
    '#state': `window.initialState = ${JSON.stringify(state)}`,
    '#styles': fs.createReadStream(path.join(__dirname, '/styles.css'))
  })
}
