var express = require('express'),
    path = require('path'),
    fs = require('fs');

var app = express();
var staticRoot = __dirname + '/';

app.set('port', (process.env.PORT || 3000));

app.use(express.static(staticRoot));

app.get('/login', function (req, res) {
	res.sendfile(__dirname + '/public/login.html');
});

app.listen(app.get('port'), function() {
    console.log('app running on port', app.get('port'));
});
