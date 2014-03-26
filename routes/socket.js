/*
 * Serve content over a socket
 */
var streamFromClient;
module.exports = function (socket) {
	var ss = require('socket.io-stream');
	var path = require('path');
	var fs = require('fs');

	socket.emit('send:name', {
		name: 'Bob'
	});

	socket.on('send1', function (data) {
		console.log ("TEST");
		// console.log(socket._streamSocket._events.newdata);
	    socket.broadcast.emit('send:time', data);
	});

	socket.on('updatePos:acceleration', function (data) {
	    socket.broadcast.emit('newPos:acceleration', data);
	});

	socket.on('firstConnect', function (data) {
	    socket.broadcast.emit('firstConnectBroadcast', data);
	});
	
	ss(socket).on('streamFromClient', function (stream, data) {
		console.log ("streamFromClient EMITTED");
		console.log (stream);
		console.log ("test");

		streamFromClient = stream;
		stream.write("TEST DATA TO CLIENT");
		// stream.pipe(process.stdout);

		// var StringDecoder = require('string_decoder').StringDecoder;
		// var decoder = new StringDecoder('utf8');
		// stream.on('data', function(chunk) {
		// 	// console.log("NEWDATA");
		// 	// console.log(decoder.write(chunk));
		// });

	});

	ss(socket).on('newdata', function (stream, data) {
		// console.log (socket._streamSocket._events.newdata);
		console.log ("NEWDATA EMITTED");
		console.log (data);
		console.log ("test");
		var filename = path.basename(data.name);
		// stream.pipe(process.stdout);

		var StringDecoder = require('string_decoder').StringDecoder;
		var decoder = new StringDecoder('utf8');
		stream.on('data', function(chunk) {
			console.log("NEWDATA");
			console.log(streamFromClient);
			console.log("test");
			// console.log(decoder.write(chunk));
		});


		if (streamFromClient){
			console.log ('STREAMS PIPED');
		    stream.pipe(streamFromClient);
		}


	// 	// var StringDecoder = require('string_decoder').StringDecoder;
	// 	// // function parseHeader(stream, callback) {
	// 	//   // stream.on('error', callback);
	// 	//   stream.on('readable', onReadable);
	// 	//   var decoder = new StringDecoder('utf8');
	// 	//   var header = '';
	// 	//   function onReadable() {
	// 	//     var chunk;
	// 	//     while (null !== (chunk = stream.read())) {
	// 	//       var str = decoder.write(chunk);
	// 	//       if (str.match(/\n\n/)) {
	// 	//         // found the header boundary
	// 	//         var split = str.split(/\n\n/);
	// 	//         header += split.shift();
	// 	//         var remaining = split.join('\n\n');
	// 	//         var buf = new Buffer(remaining, 'utf8');
	// 	//         if (buf.length)
	// 	//           stream.unshift(buf);

	// 	//       	console.log (str);
	// 	//         // now the body of the message can be read from the stream.
	// 	//         callback(null, header, stream);
	// 	//       } else {
	// 	//         // still reading the header.
	// 	//         header += str;
	// 	//       }
	// 	//     }
	// 	//   }
	// 	// }

	// 	// console.log (stream);
	// 	// console.log (data);
	});



	// ss(socket).on('newdata', function (stream, data) {
	// 	console.log ("NEWDATA EMITTED");
	// 	console.log (stream);
	// 	console.log (data);
	// 	// var filename = path.basename(data.name);
	// 	// stream.pipe(fs.createWriteStream(filename));
	// });
  // setInterval(function () {
  //   socket.emit('send:time', {
  //     time: (new Date()).toString()
  //   });
  // }, 2000);
};
