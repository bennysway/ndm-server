const express = require('express')
const app = express()
const expressWs = require('express-ws')(app)
const clients = new Set()
const group = new Set()

app.ws('/ws', (ws, req) => {
	clients.add(ws)
	ws.timestamp = new Date().getTime()
	ws.send(JSON.stringify({ status: "Connected" }))
	console.log(ws._socket.remoteAddress + " connected")

	ws.on('message', (commandString) => {
		try {
			let command = JSON.parse(commandString)
			handleCommand(ws, command)
		} catch (e) {
			console.log(commandString)
		}
		ws.timestamp = new Date().getTime()
	});
	ws.on('close', () => {
		console.log(ws._socket.remoteAddress + ' closed')
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
		if ((new Date().getTime()) - client.timestamp > 120000) {
			client.terminate()
			clients.delete(client)
			console.log("close a client")
		} else {
			client.send("ping")
		}
	});
}, 60000);

function handleCommand(ws, command) {
	switch (command.action) {
		case "join":
			console.log("Client joined: " + ws._socket.remoteAddress)
			break
		case "leave":
			console.log("Client left: " + ws._socket.remoteAddress)
			break
		case "open":
			console.log("Open " + command.contentId + " from screen " + command.fragment)
			break
		case "close":
			console.log("Closed " + command.contentId)
			break
		case "pong":
			ws.isAlive = true
			console.log("Client " + ws._socket.remoteAddress + " alive")
			break
		case "g1Move":
			console.log(command.move)
			break
		default:
			break
	}
}
module.exports = app