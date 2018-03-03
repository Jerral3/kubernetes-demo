let amqp    = require('amqplib');
let connect = require('../../server/boot/connect');
let app     = require('../../server/server');

var searchWord = function (word, filepath, callback) {
    let parameters    = {
        filepath : filepath,
        word     : word
    };

    let correlation = generateUuid();

	connect.init().then((channel) => {
		channel.assertQueue().then((queue) => {
			console.log("waiting on", queue);
			channel.consume(queue.queue, (msg) => {
				console.log("received");
				if (msg.properties.correlationId === correlation) 
					callback(null, handleResult(msg.content.toString(), filepath));
			}, {noAck: true});

			channel.sendToQueue(app.get('rabbitMqControlQueue'), new Buffer(JSON.stringify(parameters)), { correlationId: correlation, replyTo: queue.queue });
		}).catch(() => {
		});
	});
}

var handleResult = function (message, filepath) {
	var result = JSON.parse(message)['result'];

	return {filepath: filepath, result: result};
}

var generateUuid = function () {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

module.exports.searchWord = searchWord;
