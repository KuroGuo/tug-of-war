var express = require('express')
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('client'))

app.get('/vue.js', function (req, res, next) {
  res.sendFile(__dirname + '/node_modules/vue/dist/vue.min.js', function (err) {
    if (err)
      return next(err)
  })
})

app.use(function (req, res, next) {
  res.status(404).send('Not Found.')
})

var data = {
  teams: {
    a: { score: 0, power: 0 },
    b: { score: 0, power: 0 }
  }
}

io.on('connection', function (socket) {
  socket.emit('update', data)

  var timeoutId

  socket.on('tug', function (team) {
    if (timeoutId)
      return

    timeoutId = setTimeout(function () {
      timeoutId = null

      if (data.teams[team])
        data.teams[team].score += 1

      io.emit('update', data)
    }, 16)
  })
})

var lastTime = new Date().getTime()
var lastScoreA = data.teams.a.score
var lastScoreB = data.teams.b.score

setInterval(function () {
  var now = new Date().getTime()
  var timespan = (now - lastTime)

  data.teams.a.power = (data.teams.a.score - lastScoreA) / timespan * 1000
  data.teams.b.power = (data.teams.b.score - lastScoreB) / timespan * 1000

  lastTime = now
  lastScoreA = data.teams.a.score
  lastScoreB = data.teams.b.score
}, 1000)

http.listen(1338)