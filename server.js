var express = require('express');
var app = express();

var msglist=[];

var http = require('http');
var server = http.Server(app);

app.use(express.static('client'));

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  io.emit('news', { datalist:msglist }); 
    
    socket.on('message', function (msg) {    
        console.log('Received Message: ', msg);
        msglist.push(msg);
        io.emit('message', msg);
        if (msg.indexOf("weather") >=0 && isquestion(msg)){
            getWeather(msg, function(weather){
                msglist.push(weather);
                io.emit('message', weather);
            });
        }
        if (msg.indexOf("time") >=0 && isquestion(msg)){
            getTime(msg, function(tmsg){
                msglist.push(tmsg);
                io.emit('message', tmsg);     
            });
        }
    });
});

function isquestion(msg){
    return msg[msg.length - 1] === "?"
}

function getTime(msg, callback){
     var d = msg.substring(0,11); 
     var tmsg = d + "> SERVER: Current local_time is: " + d
     callback(tmsg);
}

function getWeather(msg, callback) {
  var request = require('request');
  request.get("https://www.metaweather.com/api/location/4118/", function (error, response) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(response.body);
      var result = msg.substring(0,11) +  "> SERVER: Current local_forecast is: " + data.consolidated_weather[0].weather_state_name;   
      callback(result);
    }
  })
}


server.listen(8080, function() {
  console.log('Chat server running');
});