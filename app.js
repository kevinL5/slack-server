const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const mongoose = require('mongoose')
var format = require('date-fns/format')

//Models
const Channel = require('./models/channel')
const Message = require('./models/message')
const User = require('./models/user')

const PORT = 3001

mongoose.connect('mongodb://localhost:27017/slack')

const messages = []

//CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	)
	next()
})

io.on('connection', socket => {
	console.log('new user connected')

	socket.on('request messages', channel => {
		Message.find()
			.populate('user')
			.exec((err, messages) => {
				console.log('MESSAGES', messages)
				socket.emit('all messages', messages)
			})
	})

	// Nouveau message : loginUser() -> newMessage()
	socket.on('new message', data => {
		console.log('Nouveau message:', data)
		loginUser(data)
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})

loginUser = data => {
	console.log('DATA', data)
	User.findOne({ name: data.user }).exec((err, user) => {
		console.log('USER', user)
		if (!user) {
			const newUser = new User({ name: data.user })
			newUser.save((err, obj) => {
				if (err) return console.log(err)
				if (!err) return newMessage(data, obj)
			})
		}
		newMessage(data, user)
	})
}

newMessage = (data, user) => {
	console.log('USER', user.name)
	const newMessage = new Message({
		text: data.text,
		time: format(Date.now(), 'HH:mm'),
		user: user
	})

	newMessage.save((err, message) => {
		console.log('message', message)
		if (!err)
			io.in('Kévin').emit('update message', {
				text: message.text,
				time: message.time,
				user: { name: user.name }
			})
	})
}

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
