const jsonServer = require('json-server')
const server = jsonServer.create()
const snRouter = jsonServer.router('sn.json')
const enRouter = jsonServer.router('en.json')
const port = process.env.PORT || 8080;
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use('/api/sn',router)
server.use('/api/sn',router)
server.listen(port, () => {
  console.log('JSON Server is running')
})