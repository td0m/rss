import { init as initDb, repo } from './db.js'
import { icons } from './icons.js'
import { pull } from './pull.js'

initDb()

repo.feeds.upsert({
  id: "last-free-nation",
  url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCKNWJMaiiBSPOH0qiWdO0lQ",
  status: "enabled",
  icon: "https://yt3.googleusercontent.com/8t7ahX_xQvHRt-STE9m_ZSmxqXh_Mr6YMBcgesQ3Vb9iRUO13bDnKx7ueZnpn9_80QOiFBTupQ=s160-c-k-c0x00ffffff-no-rj"
})

await pull()
