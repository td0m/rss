import Parser from 'rss-parser';
import { setTimeout } from 'timers/promises'
import { repo } from './db.js'
import { hash } from 'node:crypto';

function md5(text) {
  return hash('md5', text, 'hex');
}

function parseItem(item, feedId) {
  const timestamp = new Date(item.pubDate ?? item.isoDate)
  const media = []
  const links = []
  if (item.enclosure) {
    media.push({
      type: item.enclosure.type,
      url: item.enclosure.url,
      length: item.enclosure.length
    })
  }
  if (item.comments) {
    links.push({ url: item.comments, title: `comments` })
  }
  return {
    id: feedId + ":" + md5(item.id ?? item.guid ?? item.link),
    feedId: feedId,
    title: item.title,
    link: item.link,
    links,
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
    await setTimeout(1000)
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


