const express = require('express')
const app = express()
const expressWs = require('express-ws')(app)
const clients = new Set()

app.ws('/ws', (ws, req) => {
	clients.add(ws)
	ws.send(JSON.stringify({status: "Connected"}))
	console.log(ws._socket.remoteAddress + " connected")

	ws.on('message', (commandString) => {
		let command = JSON.parse(commandString)
		handleCommand(ws,command)
	});
	ws.on('close', () => {
		console.log('Connection closed')
		clients.delete(ws)
	});
	ws.on('error', (msg) => {
		console.log('Connection error')
		ws.send("OFFLINE")
	});
	ws.on('pong', () => {
		ws.isAlive = true;
	});
})

setInterval(function () {
	clients.forEach(client => {
	});
}, 2000);

function handleCommand(ws, command) {
	switch (command.action) {
		case "open":
			console.log(command.contentId)
			break
		case "close":
			console.log(command.contentId)
			break
		case "g1Move":
			console.log(command.move)
			break
		default:
			break
	}
}


module.exports = app