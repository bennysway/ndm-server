var express = require('express')
var router = express.Router()
//Database Init
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://node-server_1:ndmapp@ndm-api-mvqzp.mongodb.net/test?retryWrites=true&w=majority"
const client = new MongoClient(uri)


router.get('/:collectionName', (req, res) => {
    let collectionName = req.params.collectionName
    client.connect(err => {
        client.db("ndm").collection(collectionName).find({}).toArray((err, result) => {
            if (err) {
                res.send('error')
                throw err
            }
            console.log(result)
            res.send(result)
        })
    })
})

router.get('/:collectionName/:contentId', (req, res) => {
    let collectionName = req.params.collectionName
    client.connect(err => {
        client.db("ndm").collection(collectionName).find({}).toArray((err, result) => {
            if (err) {
                res.send('error')
                throw err
            }
            console.log(result)
            res.send(result)
        })
    })
})

router.post('/:collectionName', (req, res) => {
    let collectionName = req.params.collectionName
    client.connect(err => {

        client.db("ndm").collection(collectionName).insert(req.body, (err, result) => {
            if (err) {
                res.send('error')
                throw err
            }
            console.log('Posted')
            res.send('Posted')
        })
    })
})

router.post('/:collectionName/:contentId', (req, res) => {
    let collectionName = req.params.collectionName
    client.connect(err => {

        client.db("ndm").collection(collectionName).insert(req.body, (err, result) => {
            if (err) {
                res.send('error')
                throw err
            }
            console.log('Posted')
            res.send('Posted')
        })
    })
})


module.exports = router