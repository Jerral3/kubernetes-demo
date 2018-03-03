var amqp = require('amqplib');
var app  = require("../server");

exports.init = function() {
return new Promise((resolve, reject) => {

	var connectionString = app.get('rabbitMqProtocol') + '://' +
							app.get('rabbitMqUser') + ":" + app.get('rabbitMqPassword') +
							'@' + app.get('rabbitMqHost') + ':' + String(app.get('rabbitMqPort'));
	var connection;

	amqp.connect(connectionString).then((conn) => {
		connection = conn;
		return conn.createChannel();
	}).then((channel) => {
		resolve(channel);
	}).catch((error) => {
	});
});
}
