var express = require('express')
var app = express()
var expressSession = require('express-session')
var cookieParser = require('cookie-parser')
var fs = require('fs')

app.use(cookieParser());
app.use(expressSession({ secret: 'somesecrettokenhere' }));


app.get('/', function (req, res) {
    var room = req.session.room

    if (room === undefined) {
        res.sendFile(__dirname + '/public/welcome.html')
    } else {
        res.sendFile(__dirname + `/public/${room}/index.html`)
    }
})

app.get('/start', function (req, res) {
    req.session.room = 'bedroom'
    res.redirect('/')
})

app.get('/:item?/:command?', function (req, res) {
    var item = req.params['item']
    var command = req.params['command']
    var room = req.session.room

    if (room === undefined) {
        res.redirect('/')
    } else {
        if (item === undefined) {
            res.redirect('/')
        } else if (command === undefined) {
            res.sendFile(__dirname + `/public/${room}/${item}/inspect.html`)
        } else {
            var filePath = __dirname + `/public/${room}/${item}/${command}.html`
            if (fs.existsSync(filePath)) {
                res.sendFile(filePath)
            } else {
                res.send('No luck this time, bub.')
            }
        }
    }
})

app.listen(3000, function () {
    console.log('Hello World is listening on port 3000!')
})