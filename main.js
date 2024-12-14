import { init as initDb, repo } from './db.js'
import { icons } from './icons.js'
import { pull } from './pull.js'

initDb()

repo.feeds.upsert({
  id: "imalittlemole",
  url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCtt4v5GIUDQihYqgHufJhZQ",
  status: "enabled",
  icon: "https://yt3.googleusercontent.com/pOCjvHAkSlLwvVzKjVvHvEh11Lc1x-ZNxSYSvZg8vE4QJu_bmcPidHiOoOlUZpSeU8C1EyXwKA=s160-c-k-c0x00ffffff-no-rj"
})

await pull()
