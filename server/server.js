const express = require('express')
const bodyParser = require('body-parser')
const WebSocket = require('ws')
const http = require('http')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const PORT = 3000
const hostName = "127.0.0.1"

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection', (ws) => {
    console.log(`connecting to ws`)

    ws.on('message', (message) => {
        console.log(`Received: `, message)
    })

    ws.on('close', () => console.log(`disconnected`))
})

app.post('/send-message', (req, res) => {
    const { data } = req.body

    if (!!data == false) {
        res.status(422).json({
            data: [],
            message: "no message content !"
        })
        return
    }

    res.status(200).json({
        data: data,
        message: "send message success!"
    })
})

app.get("/", (req, res) => {
    res.send({
        message: "Welcome to my sosmed backend services!"
    })
})

app.get("/student", (req, res) => {
    res.send({
        message: "this end point for fetch student API!"
    })
})

app.post("/student", (req, res) => {
    res.send({
        message: "this end point for store data student API!"
    })
})

app.put("/student/:id", (req, res) => {
    res.send({
        message: "this end point for update data student API!"
    })
})

app.delete("/student/:id", (req, res) => {
    res.send({
        message: "this end point for delete data student API!"
    })
})

server.listen(PORT, () => console.log(`Server running at http://${hostName}:${PORT}`))