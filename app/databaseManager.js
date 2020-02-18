var express = require('express')
var router = express.Router()
//Database Init
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://node-server_1:ndmapp@ndm-api-mvqzp.mongodb.net/test?retryWrites=true&w=majority"
const client = new MongoClient(uri)
const cacheService = require('../services/cache')
const ttl = 60 * 60 * 1; 
const cache = new cacheService(ttl);


router.get('/:collectionName', (req, res) => {
    let collectionName = req.params.collectionName
    const key = "get_" + collectionName;
    cache.get(key, () => {
        return MongoClient.connect(uri)
            .then(db => {
                var dbo = db.db("ndm");
                dbo.collection(collectionName).find({}).toArray(function (err, result) {
                    if (err) throw err;
                    return result
                });
            })
    }).then(result => console.log('c'+result))
    
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
            res.json(result).status(200)
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
            res.json({ success: true }).status(200)
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
            res.json({ success: true }).status(200)
        })
    })
})


module.exports = router