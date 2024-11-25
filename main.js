import { init as initDb, repo } from './db.js'
import { icons } from './icons.js'
import { pull } from './pull.js'

initDb()

repo.feeds.upsert({
  id: "social-animal",
  url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCsMcTtQH_YWD-qBgy3vY9JQ",
  status: "enabled",
  icon: icons.yt,
})

repo.feeds.upsert({
  id: "best-hn",
  url: "https://hnrss.org/best",
  status: "disabled",
  icon: icons.hn,
})

repo.feeds.upsert({
  id: "kevin-powell",
  url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCJZv4d5rbIKd4QHMPkcABCw",
  status: "enabled",
  icon: icons.yt,
})

repo.feeds.upsert({
  id: "changelog",
  url: "https://changelog.com/master/feed",
  status: "enabled",
  icon: "https://cdn.changelog.com/static/images/podcasts/master-original-3922a5ce5ede81d973adc3cd618f7e64.png"
})

await pull()
