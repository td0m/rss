import { init as initDb, repo } from './db.js'
import { icons } from './icons.js'
import { pull } from './pull.js'

initDb()

repo.feeds.upsert({
  id: "taylor-town",
  url: "https://taylor.town/feed.xml",
  status: "enabled",
  icon: "http://taylor.town/favicon.ico"
})

await pull()
