const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('sn.json')
const port = process.env.PORT || 8080;
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use('/api',router)
server.listen(port, () => {
  console.log('JSON Server is running')
})