const jsonServer = require('json-server')
const fs = require('fs')
const server = jsonServer.create()
const port = process.env.PORT || 8080;
const middlewares = jsonServer.defaults()

const snRouter = jsonServer.router('sn_zw.json')
const enRouter = jsonServer.router('en_zw.json')
const manifestRouter = jsonServer.router('manifest.json')
const publicRouter = jsonServer.router('public.json')

server.use(middlewares)
//time updaters
server.post('/devotions', (req, res, next) => {
    readManifestAndUpdate('devotion_ndm_ZW')
    next()
});
server.post('/music', (req, res, next) => {
    readManifestAndUpdate('music_ndm_ZW')
    next()
});
server.post('/events', (req, res, next) => {
    readManifestAndUpdate('event_ndm_ZW')
    next()
});
server.post('/announcements', (req, res, next) => {
    readManifestAndUpdate('announcement_ndm_ZW')
    next()
});

//api
server.use('/api/sn',snRouter)
server.use('/api/en',enRouter)
server.use('/api/manifest',manifestRouter)
//finally
server.use(publicRouter)
//

function readManifestAndUpdate(databaseId){
    fs.readFile('manifest.json', (err, data) => {
        if (err) {
            throw err;
            console.log("Cannot update lastModified")
        } else {
            try {
                content = JSON.parse(data)
                updateManifest(databaseId)
                //console.log(manifestObject)
            } catch (e) {
                console.log("Cannot find Database in manifest")
            }
        }
    })
}
function updateManifest(dbId) {
    fs.readFile('manifest.json', (err, data) => {
        if (err) {
            throw err;
            console.log("Cannot update lastModified")
        } else {
            try {
                stringData = data.toString()
                content = JSON.parse(stringData)
                manifestOldTime = getDatabaseTimeById(content.databases, dbId)
                console.log(manifestOldTime)
                stringData = stringData.replace(manifestOldTime.toString(), (new Date()).getTime().toString())
                fs.writeFile('manifest.json', stringData, err=> {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                }); 
            } catch (e) {
                console.log("Cannot update Database in manifest")
                console.log(e)
            }
        }
    })
}
function getDatabaseTimeById(db, dbId) {
    return db.filter(data => {
        return data.databaseId == dbId
    })[0].lastModified
}

server.listen(port, () => {
  console.log('JSON Server is running')
})