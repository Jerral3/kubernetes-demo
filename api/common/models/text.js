const searchLib = require('../utils/searchLib');
const root      = require('../../server/datasources.json').textStorage.root;

module.exports = function(Text) {
    Text.search = function(word, callback) {
    	word = "set";
    	Text.find({}, function(error, texts) {
    		if (error)
    			return callback(error);

    		var count   = texts.length;
    		var results = [];

    		for (text of texts) {
				searchLib.searchWord(word, text.location, (error, result) => {
					if (error)
						return callback(error);

					console.log(result)
					results.push(result);

					if (results.length == count)
						return callback(null, results);
				});
			};
		});
    };

    Text.remoteMethod('search', {
        description: 'search word in all texts',
        accepts: [
            { arg: 'word', type: 'string', http:{ source: 'query'} }
        ],
        returns: { arg: 'results', type: 'array', root: true },
        http: { path: '/search', verb: 'post'}
    });

	Text.upload = function (ctx,options,cb) {
		if(!options) options = {};

		ctx.req.params.container = 'uploaded';

		Text.app.models.TextContainer.upload(ctx.req, ctx.result, options, function (err,fileObj) {
			if(err)
				cb(err);

			var fileInfo = fileObj.files.file[0];
			
			Text.create({
				name: fileInfo.name,
				type: fileInfo.type,
				container: fileInfo.container,
				location: root + fileInfo.container + "/" + fileInfo.name
			},function (err,obj) {
				if (err !== null) {
					cb(err);
				} else {
					cb(null, obj);
				}
			});
		});
	};

	Text.remoteMethod('upload', {
		description: 'Uploads a file',
		accepts: [
			{ arg: 'ctx', type: 'object', http: { source:'context' } },
			{ arg: 'options', type: 'object', http:{ source: 'query'} }
		],
		returns: {
			arg: 'fileObject', type: 'object', root: true
		},
		http: {verb: 'post'}
	});
};
