import Parser from 'rss-parser';
import { repo } from './db.js'

function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex')
}

function parseItem(item, feedId) {
  const timestamp = new Date(item.pubDate ?? item.isoDate)
  const media = []
  if (item.enclosure) {
    media.push({
      type: item.enclosure.type,
      url: item.enclosure.url,
      length: item.enclosure.length
    })
  }
  return {
    id: feedId + ":" + (item.id ?? item.guid ?? md5(item.link)),
    feedId: feedId,
    title: item.title,
    link: item.link,
    timestamp: timestamp.toISOString(),
    status: "unread",
    media,
    rawData: item
  }
}

export async function pull() {
  let parser = new Parser();

  const feeds = repo.feeds.list({})
  for (let feed of feeds) {
    try {
      let feedResults = await parser.parseURL(feed.url);
      feedResults.items.forEach(rssItem => {
        const item = parseItem(rssItem, feed.id)
        repo.items.upsert(item)
      });
      console.log(`fetched ${feedResults.items.length} from ${feed.id}`)
    } catch(err) {
      console.log("FAILED TO FETCH: ", feed.id, err)
    }
  }
}


