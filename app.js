var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    request = require('request'),
    rp = require('request-promise'),
    convertExcel = require('excel-as-json').processFile,
    https = require('https'),
    http = require('http');

var router = express.Router();
var app = express();

var staticRoot = __dirname + '/';

app.set('port', (process.env.PORT || 3000));

app.use(express.static(staticRoot));

app.use(function (req, res, next) {
    var ext = path.extname(req.path);
    (ext === '') ? next(): res.status(403).send('No permission for file.');
});

// Get default route
app.get('/', function (req, res) {
    res.sendFile(staticRoot + 'index.html');
    res.send(req);
});

// Get login route
app.get('/login', function (req, res) {
    res.sendFile(staticRoot + 'login.html');
});

app.get('/excel', function (req1, res1) {
    var fileUrl2 = 'https://sjjuea.db.files.1drv.com/y4mlPsG8UQ_3QCpVZs7zHG6bGQ-ZdEkJT5fQElxRW1sdmdouPvpU1gmxUtSUvw1FWfX-EGKpJOeQ7m_MuTtpExGXvLNN9CXdeBpxFs86ZYFq-3_v06PjYjfjpKZ7JQdRKhBh1UucwRHGXNM54Hr1JCKjQ/exampl.xlsx?download&psid=1';
    var dest = 'assetFile';
    var file = fs.createWriteStream(dest + '.xlsx');
    var convertOptions = { sheet: 1 };
    https.get(fileUrl2, function (res2) {
        res2.on("error", (err) => {
              console.log("Error: " + err.message);
            });
        res2.pipe(file);
        convertExcel(dest + '.xlsx', dest + '.json', convertOptions, function (error1, data1) {
            if(error1){ 
                console.log(error1);
                res1.status(500).send('Something went wrong with converting xlsx file.');
            }
            res1.setHeader('Content-Type', 'application/json');
            res1.status(200).send(JSON.stringify(data1, null, 3));
        });
    });
});

// Route not exists
app.use(function (req, res) {
    res.status(404).send('Page not found.');
});

app.listen(app.get('port'), function () {
    console.log('app running on port', app.get('port'));
});