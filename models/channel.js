const mongoose = require('mongoose')

const channelSchema = new mongoose.Schema({
	name: String,
	messages: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	]
})

module.exports = mongoose.model('Channel', channelSchema)
