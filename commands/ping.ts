import { performance } from 'perf_hooks'
import fs from 'fs-extra'
import utils from '../utils'

module.exports = async (client, context) => {
  let [ram, usage] = [Math.round(process.memoryUsage().rss / 1024 / 1024), +(await utils.getData('commandUsage')) + 1]
  let t0 = performance.now()
  await client.ping()
  let t1 = performance.now()
  let latency = Math.round((t1 - t0))
  utils.setData('commandUsage', usage)
  return { success: true, reply: `PunOko 🏓 | Prefix: "${context.prefix.trim()}" | Latency: ${latency} ms | Channels Joined: ${utils.getChannels().length} | Bot Uptime: ${utils.formatTime(Math.round(process.uptime() * 1000))} | Commands Used: ${usage} | RAM Usage: ${ram} MB | Info: https://bot.darkvypr.com | Use "${context.prefix}request" for info on requesting the bot.` }
}