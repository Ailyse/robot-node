var express = require('express');
var oaApiRoutes = require('./dev-api-routes/openAgenda-api-routes-dev');
var app = express();

var jsonParser = express.json({  extended: true}); 
app.use(jsonParser);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods",
               "POST, GET, PUT, DELETE, OPTIONS"); 
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/html', express.static(__dirname+"/html"));
app.get('/', function(req , res ) {
  res.redirect('/html/index.html');
});

app.use(oaApiRoutes.apiRouter);

let backendPort = process.env.PORT; 
const host = '0.0.0.0';
app.listen(backendPort , host, function () {
  console.log("http://localhost:"+backendPort);
});