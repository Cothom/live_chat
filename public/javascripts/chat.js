window.onload = function() {
    var socket = io.connect('localhost:8080');
    var messages = [];
    var sendButton = document.getElementById('sendButton');

    socket.on('message', function(data) {
        if (data.message) {
            messages.push(data.message);
            msgHtmlCode = '';
            for (var i = 0; i < messages.length; i++) {
                if (messages[i].author && messages[i].content) {
                    msgHtmlCode += messages[i].author + '> ' + messages[i].content + '<br />';
                }
            }
            document.getElementById('message_boxes').innerHTML = msgHtmlCode;
        }
    });

    sendButton.onclick = function() {
        var message = {};
        message.author = document.getElementById('username').innerText;
        message.content = document.getElementById('tosendtext').value;
        document.getElementById('tosendtext').value = '';
        socket.emit('sendmessage', { message: message});
    };
}