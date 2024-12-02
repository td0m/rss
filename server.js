import Fastify from 'fastify'
import cron from 'node-cron'
import { icons } from './icons.js'
import { init as initDb, repo } from './db.js'
import { pull } from './pull.js'

initDb()

const app = Fastify({
})

app.get("/feeds", (req, res) => {
  const lastFetch = repo.lastFetched()
  res.send({
    lastFetch,
  })
})

app.get("/items", (req, res) => {
  const { status } = req.query
  const items = repo.items.list({
    status,
  })
  res.send(items)
})

app.patch("/items/:rawId", (req, res) => {
  const id = decodeURIComponent(req.params.rawId)
  const patch = req.body
  const [item] = repo.items.list({id})
  const patched = { ...item, ...patch }
  console.log("P", item, patch, patched)
  repo.items.update(patched)
  res.send(patched)
})

app.listen({ port: 5852 })


await pull()
  cron.schedule('0 9 * * *', async () => {
  await pull()
});
