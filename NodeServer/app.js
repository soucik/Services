var express = require('express')
	, app = express()
	, http = require('http')
	, server = http.createServer(app)
	, io = require('socket.io').listen(server);

server.listen(8080);

app.use(express.static(__dirname + '/public'));

// routing
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});
////////////////////////////////////////////////////////////

app.get('/BeautyCodeSalon/album/:albumId', function (req, result) {
	var request = require('request');

	request.get('https://graph.facebook.com/v2.10/10204426332601677/photos?access_token=EAACEdEose0cBAEu341tqQMU6PMr3rD9ZCokuIMrZAeu3lYQ29Cej6mYGqTcmtwNQzEAuZBlnDj2p1pLXZB1mbqBcZCZAuMdQBcZCq5urMSTjJGrLXQJKpNn9ZBMzZAeSWwmZB10RURZCdkiwveZB2TAkskD8qb7cP6u1gVxpspo1ZBSs1GipJMZBZBvTCOfZBqLAqVck1MoZD', options, function (err, res, body) {
		if (err) {
			console.log(err);
		}
		if (res.statusCode) {
			result.setHeader('Content-Type', 'application/json');
			result.send(body);
		}
	});
});

app.get('/login', function (req, res) {
	res.sendfile(__dirname + '/public/login.html');
});

// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['AF313C6D972BB5D01908CB9DA8EB1CB8A64FCCEFF96773BF0BC7275E21079B5D321A264E7B0DB0643C5C5D199FD19A1190EA984A78384FDE3B2BB31902A809B6'
	, 'B7E0F896C83049A9AF5EA271BCBC00A931735BCDF4C7B6EDCD55311C56EA7EA86F9651CF508C8D646BA616AAB2338921D390CE9F6F4A21C07EBEFD7ACBDC1BB3'
	, 'BDA962F7DA28D6D000B3C2BABE4E0B9FD578FC4A15A7F984DABE74DA8E71E90310DA855B8333D017216CFFC3BF5C9F00ECB10BA7AB5F44F662B0DA44ADC1CE88'];

io.sockets.on('connection', function (socket) {

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function (username, room) {
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		socket.room = room;
		// add the client's username to the global list
		usernames[username] = username;
		// send client to room 1
		socket.join(room);
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected to chat');
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to(room).emit('updatechat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'AF313C6D972BB5D01908CB9DA8EB1CB8A64FCCEFF96773BF0BC7275E21079B5D321A264E7B0DB0643C5C5D199FD19A1190EA984A78384FDE3B2BB31902A809B6');
	});

	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function () {
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
});
