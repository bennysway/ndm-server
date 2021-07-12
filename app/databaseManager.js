var express = require('express')
var crypt = require('./Crypty')
var hash = require('object-hash');
var router = express.Router()
//Database Init
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://node-server_1:ndmapp@ndm-api-mvqzp.mongodb.net/test?retryWrites=true&w=majority"
const client = new MongoClient(uri, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
//Caching
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 300 })

router.get('/:collectionName', (req, res) => {
    let collectionName = req.params.collectionName
    let queryBody = {}
    if (req.query.queryBody != undefined) {
        queryBody = crypt.decrypt(req.query.queryBody)
        console.log("Decrypted to " + queryBody)
    }
    console.log("Query is to " + req.query.queryBody)
    let queryHash = hash(queryBody)
    let value = cache.get(collectionName + queryHash)
    if (value == undefined) {
        client.connect(err => {
            client.db("ndm").collection(collectionName).find(queryBody).toArray((err, result) => {
                if (err) {
                    res.send('error')
                    throw err
                }
                cache.set(collectionName, result)
                console.log('realtime data: ' + collectionName)
                res.json(result)
            })
        })
    }
    else {
        console.log('cached data:' + collectionName)
        res.json(value)
    }

})

router.get('/:collectionName/:contentId', (req, res) => {
    let collectionName = req.params.collectionName
    let contentId = req.params.contentId
    let query = getQuery(collectionName, contentId)
    let value = cache.get(collectionName + contentId)
    if (value == undefined) {
        client.connect(err => {
            client.db("ndm").collection(collectionName).find(query).toArray((err, result) => {
                if (err) {
                    res.send('error')
                    throw err
                }
                cache.set(collectionName + contentId, result)
                console.log('realtime data: ' + collectionName + "/" + contentId)
                res.json(result)
            })
        })
    }
    else {
        console.log('cached data: ' + collectionName + "/" + contentId)
        res.json(value)
    }
})

router.get('/commentsOn/:contentId', (req, res) => {
    let collectionName = req.params.collectionName
    let contentId = req.params.contentId
    let query = { connectedTo: contentId }
    let value = cache.get(collectionName + contentId)
    if (value == undefined) {
        client.connect(err => {
            client.db("ndm").collection('comments').find(query).toArray((err, result) => {
                if (err) {
                    res.send('error')
                    throw err
                }
                cache.set(collectionName + contentId, result)
                console.log('realtime data: ' + collectionName + "/" + contentId)
                res.json(result)
            })
        })
    }
    else {
        console.log('cached data: ' + collectionName + "/" + contentId)
        res.json(value)
    }
})

router.post('/:collectionName', (req, res) => {
    let collectionName = req.params.collectionName
    removeCaches(collectionName)
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
    let contentId = req.params.contentId
    let query = getQuery(collectionName, contentId)
    removeCaches(collectionName)
    client.connect(err => {
        client.db("ndm").collection(collectionName).replaceOne(query, req.body, { upsert: true }, (err, result) => {
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
    let contentId = req.params.contentId
    let query = getQuery(collectionName, contentId)
    removeCaches(collectionName)
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

function removeCaches(collectionName) {
    let caches = []
    cache.keys().forEach(key => {
        if (key.includes(collectionName)) {
            caches.push(key)
        }
    })
    cache.del(caches)
}

function getQuery(collectionName, contentId) {
    switch (collectionName) {
        case "readings": return { readingId: contentId }; break;
        case "devotions": return { devotionId: contentId }; break;
        case "music": return { musicId: contentId }; break;
        case "events": return { eventId: contentId }; break;
        case "announcements": return { announcementId: contentId }; break;
        case "churches": return { churchId: contentId }; break;
        case "comments": return { commentId: contentId }; break;
        case "users": return { userId: contentId }; break;
        case "tiers": return { tierId: contentId }; break;
    }
}


module.exports = router