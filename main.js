import { init as initDb, repo } from './db.js'
import { icons } from './icons.js'
import { pull } from './pull.js'

initDb()

repo.feeds.upsert({
  id: "nathan-oxenfeld",
  url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCSPEYMIPRZLHsrn3jVAeFuA",
  status: "enabled",
  icon: "https://yt3.googleusercontent.com/ytc/AIdro_ld0tWo3_jvRuWNhTY1b-qgIMqYb3Po5WdOS1hZcBSQgQ=s160-c-k-c0x00ffffff-no-rj"
})

await pull()
