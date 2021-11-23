const express = require('express')
const http = require('http')
var cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const path = require("path")
var xss = require("xss")

var server = http.createServer(app)
var io = require('socket.io')(server)

app.use(cors({
    origin: '*'
  }))
app.use(bodyParser.json())

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + "/build"))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname + "/build/index.html"))
    })
}
app.set('port', (process.env.PORT || 3001))

sanitizeString = (str) => {
    return xss(str)
}

connections = {}
messages = {}
images = {}
timeOnline = {}
participants = {}

io.on('connection', (socket) => {
    console.log("conn");
    socket.on('join-call', (path, userId) => {
        
        console.log("Id-ul este: ", userId);
        console.log("Participanti:", participants);
        // vendors.filter(function(e) { return e.Name === 'Magenic'; }).length > 0
        if(participants[path] && participants[path].filter(function(el) { return el.id === userId}).length > 0)
             io.to(socket.id).emit("already-in-call-error");
        else
        { 
            console.log({id : userId, sockid : socket.id})
            if(participants[path])
                   participants[path].push({id : userId, sockid : socket.id});
            else 
               participants[path] = [{id : userId, sockid : socket.id}];
        
        console.log(participants);
        if (connections[path] === undefined) {
            connections[path] = []
        }
        connections[path].push(socket.id)

        timeOnline[socket.id] = new Date()

        for (let a = 0; a < connections[path].length; ++a) {
            io.to(connections[path][a]).emit("user-joined", socket.id, connections[path], userId)
        }

        if (messages[path] !== undefined) {
            for (let a = 0; a < messages[path].length; ++a) {
                io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                    messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
            }
        }
        console.log(path, connections[path])
       }
    })

    socket.on('signal', (toId, message) => {
        io.to(toId).emit('signal', socket.id, message)
    })

    socket.on('chat-message', (data, sender) => {
        data = sanitizeString(data)
        sender = sanitizeString(sender)

        var key
        var ok = false
        for (const [k, v] of Object.entries(connections)) {
            for (let a = 0; a < v.length; ++a) {
                if (v[a] === socket.id) {
                    key = k
                    ok = true
                }
            }
        }

        if (ok === true) {
            if (messages[key] === undefined) {
                messages[key] = []
            }
            messages[key].push({ "sender": sender, "data": data, "socket-id-sender": socket.id })
            console.log("message", key, ":", sender, data)

            for (let a = 0; a < connections[key].length; ++a) {
                io.to(connections[key][a]).emit("chat-message", data, sender, socket.id)
            }
        }
    })

    socket.on('image', (data, sender) => {
        data = sanitizeString(data)
        sender = sanitizeString(sender)

        var key
        var ok = false
        for (const [k, v] of Object.entries(connections)) {
            for (let a = 0; a < v.length; ++a) {
                if (v[a] === socket.id) {
                    key = k
                    ok = true
                }
            }
        }

        if (ok === true) {
            if (images[key] === undefined) {
                images[key] = []
            }
            images[key].push({ "sender": sender, "data": data, "socket-id-sender": socket.id })
            console.log("image", key, ":", sender, data)

            for (let a = 0; a < connections[key].length; ++a) {
                io.to(connections[key][a]).emit("image", data, sender, socket.id)
            }
        }
    })

    socket.on('disconnect', () => {
        var diffTime = Math.abs(timeOnline[socket.id] - new Date())

        var key
        for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
            for (let a = 0; a < v.length; ++a) {
                if (v[a] === socket.id) {
                    key = k
                    
                    
                    for (let a = 0; a < connections[key].length; ++a) {
                        io.to(connections[key][a]).emit("user-left", socket.id)
                    }

                    var index = connections[key].indexOf(socket.id)
                    connections[key].splice(index, 1)

                    participants[key] = participants[key].filter(function(el) { return el.sockid !== socket.id})
                    console.log("Noi participanti:", participants);
                    console.log(key, socket.id, Math.ceil(diffTime / 1000))

                    if(participants[key].length == 0){
                        delete participants[key];
                    }
                    if (connections[key].length === 0) {
                        delete connections[key];
                    }
                }
            }
        }
    })
})
server.listen(app.get('port'), () => {
    console.log("listening on", app.get('port'))
})