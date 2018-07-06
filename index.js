var express = require('express'),
    path = require('path'),
    fs = require('fs');

var router = express.Router();
    
var app = express();
var staticRoot = __dirname + '/';

app.set('port', (process.env.PORT || 3000));

app.use(express.static(staticRoot));

app.use(function(req, res, next){
    var ext = path.extname(req.path);
    (ext === '')? next() : res.status(403).send('No permission for file.');
});

// Get default route
app.get('/', function (req, res) {
    res.sendFile(staticRoot + 'index.html');
    res.send(req);
});

// Get login route
app.get('/login', function(req, res){
    res.sendFile(staticRoot + 'login.html');
});

// Route not exists
app.use(function(req,res){
    res.status(404).send('Page not found.');
});

app.listen(app.get('port'), function() {
    console.log('app running on port', app.get('port'));
});
