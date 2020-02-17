const express = require('express')
const firebase = require('firebase')
const jsRender = require('jsrender')
var admin = require('firebase-admin')
const firebaseConfig = require('./fireConfig')
const fs = require('fs')
const app = express()
const port = process.env.PORT || 8080;

app.use('/static', express.static('public'))

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
  });
var defaultProject = firebase.initializeApp(firebaseConfig)
var database = firebase.database();

app.get('/readings/:year/:readingsId', (req, res) => {
    var id = req.params.readingsId
    var year = req.params.year
    var readings = database.ref('/readings/' + year + '/' + id).once('value').then(snapshot => {
        console.log(snapshot.val())
        res.send(snapshot.val())
    })
})

app.get('/login', (req, res) => {
    var tmpl = jsRender.templates('./public/html/signin.html')
    var signInOptions = [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID
      ]
    res.send(tmpl.render({
        firebaseConfig: firebaseConfig,
        signInOptions: signInOptions
    }))
})


app.listen(port, () => {
    //Init server
    console.log('NDM Server is running with: ' + defaultProject.name)
})