const express = require('express')
const _ = require('lodash')
const bson = require('bson')

const Room = require('../models/room')
const Message = require('../models/message')
const config = require('../config/config')

const chatRoutes = express.Router();

var throwFailed = function (res, message) {
  return res.json({ success: false, message: message });
}

chatRoutes.post('/room/all', function(req, res) {
	Room
	    .find(
	    { "$and": [ 
		    { "between": { $elemMatch: {$in: [req.body.userId] }}}
		    ,{ "between": { $size: 2 } }
		]}
		)
	    .exec()
	    .then(function(room) {
	    	res.json(room);
	    });
});

chatRoutes.post('/room/new', function(req, res) {
    Room
	    .findOne(
	    { "$and": [ 
		    { "between": { "$all": req.body.between } },
		    { "between": { "$size": req.body.between.length } }
		]})
	    .exec()
	    .then(function(room) {
	    	if (room != null ) {
	        	return throwFailed(res, 'There is already such room exist.');
	    	} 
    		const newRoom = new Room(req.body);
		    newRoom.save(function (err, data) {
		    	if(err) {
		    		console.log(err);
		        	return res.status(500).json({msg: 'internal server error'});
		      	}

	      		res.json(data);
	    	});
	    });	
});

chatRoutes.get('/room/:id', function(req, res) {
	Room
	    .findById(req.params.id)
	    .exec()
	    .then(function(room) {
	    	res.json(room);
	    });
});

chatRoutes.post('/message/new', async function(req, res) {
	const { roomId, text, author, user } = req.body;

	try {
    	const { message } = await Room.addMessage(roomId, { text, author, user });
    	return res.json(message);
  	} catch (e) {
    	return res.status(400).json({ error: true, message: 'Message cannot be created!' });
  	}
});

chatRoutes.post('/message/all', function(req, res) {
	const { roomId, user } = req.body;

	Message
	    .find({ "roomID": roomId, 'user': user })
	    .exec()
	    .then(function(messages) {
	    	res.json(messages);
	    });
});

chatRoutes.post('/message/room', async function(req, res) {
	const { roomId, user } = req.body;

	const room = await Room.findById(roomId);

	if (!room) {
		return res.json({ error: true, message: 'Room not exist' });
  	}

  	try {
    	return res.json({
      		error: false,
     		message: await Message.find({ roomID: roomId, user: user }).populate('room'),
    	});
  	} catch (e) {
    	return res.json({ error: true, message: 'Cannot fetch message' });
  	}
});

module.exports = chatRoutes;