var express = require('express')
var router = express.Router()
//Database Init
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://node-server_1:ndmapp@ndm-api-mvqzp.mongodb.net/test?retryWrites=true&w=majority"
const client = new MongoClient(uri)
//Caching
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL:300 })

router.get('/:collectionName', (req, res) => {
    let collectionName = req.params.collectionName
    let value = cache.get(collectionName)
    if (value == undefined) {
        client.connect(err => {
            client.db("ndm").collection(collectionName).find({}).toArray((err, result) => {
                if (err) {
                    res.send('error')
                    throw err
                }
                cache.set(collectionName, result)
                console.log('rt data')
                res.json(result)
            })
        })
    }
    else {
        console.log('cached data')
        res.json(value)
    }
    
})

router.get('/:collectionName/:contentId', (req, res) => {
    let collectionName = req.params.collectionName
    let contentId = req.params.contentId
    let query = getQuery(collectionName, contentId)
    let value = cache.get(collectionName)
    if (value == undefined) {
        client.connect(err => {
            client.db("ndm").collection(collectionName).find(query).toArray((err, result) => {
                if (err) {
                    res.send('error')
                    throw err
                }
                cache.set(collectionName + contentId, result)
                console.log('rt data')
                res.json(result)
            })
        })
    }
    else {
        console.log('cached data')
        res.json(value)
    }
})

router.get('/commentsOn/:contentId', (req, res) => {
    let collectionName = req.params.collectionName
    let contentId = req.params.contentId
    let query = { connectedTo: contentId }
    let value = cache.get(collectionName)
    if (value == undefined) {
        client.connect(err => {
            client.db("ndm").collection('comments').find(query).toArray((err, result) => {
                if (err) {
                    res.send('error')
                    throw err
                }
                cache.set(collectionName + contentId, result)
                console.log('rt data')
                res.json(result)
            })
        })
    }
    else {
        console.log('cached data')
        res.json(value)
    }
})

router.post('/:collectionName', (req, res) => {
    let collectionName = req.params.collectionName
    cache.del(collectionName)
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
    cache.del(collectionName + contentId)
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

router.delete('/:collectionName/:contentId', (req, res) => {
    let collectionName = req.params.collectionName
    cache.del(collectionName + contentId)
    let query = getQuery(collectionName, contentId)
    client.connect(err => {
        client.db("ndm").collection(collectionName).deleteOne(query, (err, result) => {
            if (err) {
                res.send('error')
                throw err
            }
            console.log('Deleted')
            res.json({ success: true }).status(200)
        })
    })
})


function getQuery(collectionName, contentId){
    switch (collectionName) {
        case "readings": return {readingId : contentId}; break;
        case "devotions": return { devotionId: contentId }; break;
        case "music": return { musicId: contentId }; break;
        case "events": return { eventId: contentId }; break;
        case "announcements": return { announcementId: contentId }; break;
        case "comments": return { commentId: contentId }; break;
    }
}


module.exports = router