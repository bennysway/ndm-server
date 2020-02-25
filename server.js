const express = require('express')
const jsrender = require('jsrender')
const bodyParser = require('body-parser')
const app = express()
const expressws = require('express-ws')(app)
const port = process.env.PORT || 8080

const databaseManager = require('./app/databaseManager')

app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

app.use('/db', databaseManager)
app.ws('/ws', function (ws, req) {
    ws.on('message', (msg)=> {
        console.log(msg)
        ws.send(msg)
    });
});

app.get('/', (req, res) => {
    let tmpl = jsrender.templates('./public/html/index.html')
    res.send(tmpl.render({}))
})



app.listen(port, () => {
    //Init server
    console.log('NDM Server is running.')
})