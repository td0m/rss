import Sqlite3 from 'better-sqlite3'
export { sql } from './rawsql.js'
import { sql } from './rawsql.js'

let db

export function init() {
  db = new Sqlite3("app.db")
  db.exec(`
    CREATE TABLE IF NOT EXISTS feeds(
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT NOT NULL,
      status TEXT NOT NULL
    ) STRICT;
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS items(
      id TEXT PRIMARY KEY,
      feed_id TEXT NOT NULL REFERENCES feeds(id),
      title TEXT NOT NULL,
      link TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      status TEXT NOT NULL,
      media TEXT,
      raw_data TEXT NOT NULL,
      links TEXT NOT NULL DEFAULT '[]'
    ) STRICT;
  `)
}

const write = (literals, ...args) => {
  const stmt = sql(literals, ...args)
  return db.prepare(stmt.sql).run(stmt.params)
}

const many = (literals, ...args) => {
  const stmt = sql(literals, ...args)
  console.log(stmt.sql, stmt.params)
  const rows = db.prepare(stmt.sql).all(stmt.params)
  return rows
}

export const repo = {
  feeds: {
    upsert({id, title, url, status, icon}) {
      if (!title) title = id
      return write`
        INSERT INTO feeds(id, title, url, status, icon)
        VALUES(${id}, ${title}, ${url}, ${status}, ${icon})
        ON CONFLICT DO UPDATE
        SET
          url = ${url},
          icon = ${icon}
      `
    },
    list({status}) {
      return many`
        SELECT
          id, title, url, status, icon
        FROM feeds
      `
    }
  },
  items: {
    upsert({id, title, link, timestamp, status, rawData, feedId, media={}, links=[]}) {
      write`
        INSERT INTO items(id, title, link, timestamp, status, raw_data, feed_id, media, links)
        VALUES(${id}, ${title}, ${link}, ${timestamp}, ${status}, ${JSON.stringify(rawData)}, ${feedId}, ${JSON.stringify(media)}, ${JSON.stringify(links)})
        ON CONFLICT DO UPDATE
        SET
          media = ${JSON.stringify(media)},
          links = ${JSON.stringify(links)}
      `
    },
    update({id, title, link, timestamp, status, rawData, feedId}) {
      write`
        UPDATE items
        SET
          status = ${status}
        WHERE
          id = ${id}
      `
    },
    list({id, status, limit=1000}) {
      const rows = many`
        SELECT
          items.id, items.title, items.link, items.timestamp, items.status, items.raw_data as rawData, items.feed_id as feedId,
          items.media,
          items.links,
          feeds.icon
        FROM items
        INNER JOIN feeds ON feeds.id = items.feed_id
        ${where(
          id && sql`items.id = ${id}`,
          status && sql`items.status = ${status}`
        )}
        ORDER BY timestamp DESC
        LIMIT ${limit}
      `
      rows.map(row => {
        row.rawData = JSON.parse(row.rawData)
        if (row.media) row.media = JSON.parse(row.media)
        if (row.links) row.links = JSON.parse(row.links)
      })
      return rows
    },
  }
}

function and(...args) {
  if (args.length === 0) return sql``
  const first = args.shift()
  return sql`AND ${first} ${and(...args)}`
}

function where(...args) {
  const truthy = args.filter(a => !!a)
  if (truthy.length === 0) return sql``
  const first = truthy.shift()
  return sql`WHERE ${first} ${and(...truthy)}`
}
