const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080

const databaseManager = require('./app/databaseManager')

app.use(bodyParser.json())
app.use('/static', express.static('public'))
app.use('/db',databaseManager)

app.listen(port, () => {
    //Init server
    console.log('NDM Server is running.')
})