window.onload = function() {
    var socket = io.connect('localhost:8080');
    var messages = [];
    var sendButton = document.getElementById('sendButton');

    socket.on('message', function(data) {
        if (data) {
            messages.push(data);
            var msgHtmlCode = '';
            //for (var i = 0; i < messages.length; i++) {
            if (data.author && data.content) {
                    msgHtmlCode += data.author + '> ' + data.content + '<br />';
                }
            }
            document.getElementById('message_boxes').innerHTML += msgHtmlCode;
        }
    });

    sendButton.onclick = function() {
        var message = {};
        message.date = Date.now();
        console.log(Date.now());
        message.author = document.getElementById('username').innerText;
        message.content = document.getElementById('tosendtext').value;
        document.getElementById('tosendtext').value = '';
        socket.emit('sendmessage', message);
    };
}