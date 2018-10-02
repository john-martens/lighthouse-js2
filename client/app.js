var socket = io();

$("button").on('click', function() {
  var text = $("#message").val();
  var who = $("#initials").val();
  var d = new Date();
  socket.emit('message', d.toLocaleTimeString() + "> " + who + ": " + text);
  $('#message').val('');
  
  return false;
});

socket.on('message', function (msg) {
  $('<li>').text(msg).appendTo('#history');
    if(msg.indexOf("time is it?") > -1){
        var d = new Date().toLocaleTimeString(); 
        var msg = d + "> SERVER: Time is: " + d
        socket.emit('message', msg);
    }
});


socket.on('news', function (data) {
    var x = data.datalist;
    $("#history").html("");
    for(var i=0; i<x.length; i++)
        $('<li>').text(x[i]).appendTo('#history');
});


socket.on('connection', function () {
  socket.emit("getlist");    
});