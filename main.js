import { init as initDb, repo } from './db.js'
import { icons } from './icons.js'
import { pull } from './pull.js'

initDb()

repo.feeds.upsert({
  id: "hn-search-neovim",
  url: "https://hnrss.org/newest?q=neovim",
  status: "enabled",
  icon: icons.hn
})

await pull()
