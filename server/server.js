const express = require('express')
const bodyParser = require('body-parser')
const WebSocket = require('ws')
const http = require('http')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { student, User } = require('./models')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const PORT = 3000
const hostName = "127.0.0.1"
const JWT_SECRET = 'kunci-api' 

//-_-
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']
  if (!token) {
    return res.status(403).json({ message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection', (ws) => {
    console.log(`connecting to ws`)

    ws.on('message', (message) => {
        console.log(`Received: `, message)
    })

    ws.on('close', () => console.log(`disconnected`))
})

// reg
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.create({ username, password })
        res.status(201).json({ message: 'User created successfully', user: { id: user.id, username: user.username } })
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error: error.message })
    }
})

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ where: { username } })
        
        if (!user || !user.validPassword(password)) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' })
        res.json({ token, user: { id: user.id, username: user.username } })
    } catch (error) {
        res.status(400).json({ message: 'Error logging in', error: error.message })
    }
})

// 
app.get("/student", verifyToken, async (req, res) => {
    try {
        const students = await student.findAll()
        res.json(students)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error: error.message })
    }
})

app.get("/student/:id", verifyToken, async (req, res) => {
    try {
        const studentData = await student.findByPk(req.params.id)
        if (!studentData) {
            return res.status(404).json({ message: 'Student not found' })
        }
        res.json(studentData)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student', error: error.message })
    }
})

app.post("/student", verifyToken, async (req, res) => {
    try {
        const newStudent = await student.create(req.body)
        res.status(201).json(newStudent)
    } catch (error) {
        res.status(400).json({ message: 'Error creating student', error: error.message })
    }
})

app.put("/student/:id", verifyToken, async (req, res) => {
    try {
        const [updated] = await student.update(req.body, {
            where: { id: req.params.id }
        })
        if (updated) {
            const updatedStudent = await student.findByPk(req.params.id)
            res.json(updatedStudent)
        } else {
            res.status(404).json({ message: 'Student not found' })
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating student', error: error.message })
    }
})

app.delete("/student/:id", verifyToken, async (req, res) => {
    try {
        const deleted = await student.destroy({
            where: { id: req.params.id }
        })
        if (deleted) {
            res.json({ message: 'Student deleted successfully' })
        } else {
            res.status(404).json({ message: 'Student not found' })
        }
    } catch (error) {
        res.status(400).json({ message: 'Error deleting student', error: error.message })
    }
})

server.listen(PORT, () => console.log(`Server running at http://${hostName}:${PORT}`))