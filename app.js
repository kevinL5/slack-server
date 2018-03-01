const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const PORT = 3001
const messages = []

io.on('connection', socket => {
	console.log('New client connected')
	io.emit('all messages', messages)

	socket.on('new message', message => {
		console.log('Nouveau message:', message)
		messages.push(message)
		io.emit('update message', message)
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
