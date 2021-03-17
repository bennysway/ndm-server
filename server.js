const express = require('express')
const jsrender = require('jsrender')
const bodyParser = require('body-parser')
const app = express()
const expressws = require('express-ws')(app)
const port = process.env.PORT || 80

const databaseManager = require('./app/databaseManager')
const webSocketManager = require('./app/webSocketManager')

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/public'))

app.use(webSocketManager)
app.use('/db', databaseManager)

app.get('/', (req, res) => {
    let tmpl = jsrender.templates('./public/html/home.html')
    res.send(tmpl.render({variable: "New App"}))
})

app.listen(port, () => {
    //Init server
    console.log('NDM Server is running on port ' + port)
})