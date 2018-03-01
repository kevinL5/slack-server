const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
	text: String,
	time: String,
	channel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Channel'
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
})

module.exports = mongoose.model('Message', messageSchema)
