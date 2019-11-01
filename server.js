const jsonServer = require('json-server')
const server = jsonServer.create()
const snRouter = jsonServer.router('sn_zw.json')
const enRouter = jsonServer.router('en_zw.json')
const manifestRouter = jsonServer.router('manifest.json')
const port = process.env.PORT || 8080;
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use('/api/sn',snRouter)
server.use('/api/en',enRouter)
server.use('/api/manifest',manifestRouter)
server.listen(port, () => {
  console.log('JSON Server is running')
})