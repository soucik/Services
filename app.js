var express = require('express')
	, app = express()
	, http = require('http')
	, request = require('request')
	, rp = require('request-promise')
	, server = http.createServer(app)
	, io = require('socket.io').listen(server);

server.listen(8080);

// const keys_private = require('./private/keys_private.js');

// function ImagesFromIdResolver() {
// 	this._baseUrl = 'https://graph.facebook.com/v2.10/';
// 	this._access_token = keys_private.access_token();
// 	this._images = new Array();
// }

// ImagesFromIdResolver.prototype.getUrlFromId = function (photoId) {
// 	let photosUrlsWithIds = this._baseUrl + photoId + '/picture' + '?fields=url' + '&type=' + 'album' + '&access_token=' + this._access_token;
// 	console.log(photosUrlsWithIds);
// 	rp(photosUrlsWithIds)
// 		.then(res => { return res.url });
// }

app.use(express.static(__dirname + '/public'));

// var resolver = new ImagesFromIdResolver();

////////////////////////////////////////////////////////////
//	request:	/
//	response:	index.html
//	http://localhost:8080/
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

////////////////////////////////////////////////////////////
//	request:	/BeautyCodeSalon/album/:albumId
//	response:	data:[{created_time: "date", id: "value"},{created_time: "date", id: "value"}]
//	http://localhost:8080/BeautyCodeSalon/album/10204426332601677
app.get('/BeautyCodeSalon/album/:albumId', function (request, response) {
	var options = {
		method: 'GET',
		uri: resolver._baseUrl + request.params.albumId + '/photos?access_token=' + resolver._access_token,
		json: true
	};
	rp(options)
		.then((res) => {
			response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
			return response.send(res.data);
		})
});

////////////////////////////////////////////////////////////
//	request:	/BeautyCodeSalon/photoUrl/:photoId/:type
//	response:	{"url":"value","id":"value"}
//	http://localhost:8080/BeautyCodeSalon/photoUrl/10204426332841683/album
app.get('/BeautyCodeSalon/photoUrl/:photoId/:photoType', function (requestClient, result) {
	photosUrlsWithIds = resolver._baseUrl + requestClient.params.photoId + '/picture' + '?' + 'type=' + requestClient.params.photoType + '&fields=url&redirect=false&access_token=' + resolver._access_token;
	console.log(photosUrlsWithIds);
	var request = require('request');
	request(photosUrlsWithIds, function (err, res, body) {
		if (err) {
			console.log(err);
		}
		if (res.statusCode) {
			result.setHeader('Content-Type', 'image/jpeg');
			result.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
			var responseData = {
				url: JSON.parse(body).data.url,
				id: requestClient.params.photoId,
				photoType: requestClient.params.photoType
			}
			result.send(JSON.stringify(responseData));
		}
	});
});

////////////////////////////////////////////////////////////
//	request:	/login
//	response:	login.html
//	http://localhost:8080/login
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
