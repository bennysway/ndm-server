const jsonServer = require('json-server')
const server = jsonServer.create()
const port = process.env.PORT || 8080;
const middlewares = jsonServer.defaults()

const snRouter = jsonServer.router('sn_zw.json')
const enRouter = jsonServer.router('en_zw.json')
const manifestRouter = jsonServer.router('manifest.json')
const publicRouter = jsonServer.router('public.json')

server.use(middlewares)
//api
server.use('/api/sn',snRouter)
server.use('/api/en',enRouter)
server.use('/api/manifest',manifestRouter)
//finally
server.use(publicRouter)
//
server.listen(port, () => {
  console.log('JSON Server is running')
})