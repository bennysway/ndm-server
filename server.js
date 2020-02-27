const express = require('express')
const jsrender = require('jsrender')
const bodyParser = require('body-parser')
const app = express()
const expressws = require('express-ws')(app)
const port = process.env.PORT || 8080

const databaseManager = require('./app/databaseManager')
const webSocketManager = require('./app/webSocketManager')

app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

app.use(webSocketManager)
app.use('/db', databaseManager)

app.get('/', (req, res) => {
    let tmpl = jsrender.templates('./public/html/index.html')
    res.send(tmpl.render({}))
})

app.listen(port, () => {
    //Init server
    console.log('NDM Server is running.')
})