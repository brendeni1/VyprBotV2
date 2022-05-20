// require("http").createServer((_, res) => res.end("Alive!")).listen(9090)
import fs from 'fs-extra'
import handler from './commands/handler'
import cooldown from './cooldown'
import utils from './utils'
import globalPing from './tools/globalPing'
import notify from './tools/notifier'
import {
  ChatClient,
  AlternateMessageModifier,
  SlowModeRateLimiter,
  IgnoreUnhandledPromiseRejectionsMixin
} from "dank-twitch-irc"
import express from "express"
var app = express()
let client = new ChatClient({
  username: process.env.TWITCH_USERNAME,
  password: process.env.TWITCH_PASSWORD,

  rateLimits: "verifiedBot",
  maxChannelCountPerConnection: 100,

  connectionRateLimits: {
    parallelConnections: 20,
    releaseTime: 300,
  },

  connection: {
    type: "websocket",
    secure: true,
  },
})

client.use(new SlowModeRateLimiter(client))
client.use(new AlternateMessageModifier(client))
client.use(new IgnoreUnhandledPromiseRejectionsMixin())

client.on("ready", () => console.log("Successfully connected to chat"))
client.on("close", (error) => {
  if (error != null) {
    console.error("Client closed due to error", error)
  }
})

const channelOptions = fs.readFileSync('./db/channels.txt').toString().split(' ')
client.connect()
client.joinAll(channelOptions)

// setInterval(function() {
//   axios.put(`https://supinic.com/api/bot-program/bot/active?auth_user=${process.env['SUPI_USER_AUTH']}&auth_key=${process.env['SUPI_USERKEY_AUTH']}`)
//     .catch(err => { client.whisper('darkvypr', `There was an error pinging Supi's API!`) })
//     .then((response) => {
//       if (response.data.statusCode == 200) { console.log('✅ SUCCESS Supinic API Ping ✅') }
//       else { console.log('⛔ UNSUCCESSFUL Supinic API Ping ⛔'); client.whisper('darkvypr', `There was an error pinging Supi's API!`) }
//     })
// }, 60000 * 5 )

client.on("PRIVMSG", async (msg) => {
  // Basic User Info

  let [user, userlow, channel, message] = [msg.displayName, msg.senderUsername, msg.channelName, msg.messageText.replace(' 󠀀', '').replace('󠀀', '')]
  console.log(`[#${channel}] ${user} (${userlow}): ${message}`)

  // Check And Send The Message 

  let sendReply = async (reply) => {
    try {
      let regex = new RegExp(process.env.BAD_WORD_REGEX)
      if (Array.isArray(reply)) {
        let profane = false
        reply.forEach(i => {
          if (regex.test(i)) {
            profane = true
          }
        })
        if (profane) {
          let emote = await utils.bestEmote(channel, ['PANIC', 'panicBasket', 'GearScare', 'cmonNep', '🫢', '😨'])
          client.me(channel, `${user} --> ${emote} Bad Word Detected ${emote}`)
          return
        }
        reply.forEach(i => {
          i = i.length > 490
            ? i.slice(0, 490) + "..."
            : i
          client.privmsg(channel, i)
        })
        return
      }
      reply = String(reply)
      reply = regex.test(reply)
        ? `${user} -->  panicBasket Bad Word Detected panicBasket`
        : `${user} --> ${reply.replace(/\n|\r/gim, '')}`

      reply = reply.length > 490
        ? reply.slice(0, 490) + "..."
        : reply
      client.me(channel, reply)
    } catch (e) {
      client.me(channel, `${user} --> ${e}`)
    }
  }

  // Notifications

  let notifications = async (target) => {
    try {
      let checkNoti = await notify.check(target)
      if (checkNoti) {
        let notis = await notify.read(target)
        await notify.remove(target)
        return {
          success: true,
          reply: `Notifications: ${notis.formatted}`
        }
      }
      return
    } catch (e) {
      return {
        success: false,
        reply: e
      }
    }
  }

  let noti = await notifications(userlow)
  if (noti) {
    sendReply(noti.reply)
  }

  // Global Pings

  let ping = globalPing({
    user: userlow,
    channel: channel,
    message: message
  })
  if (ping) {
    client.whisper('darkvypr', ping)
  }

  // Prefix

  let prefix
  try {
    prefix = await utils.getData(`${channel}Prefix`) ?? 'vb '
  } catch (e) {
    client.me(channel, `${user} --> Replit is shit, re-execute that command please!` && !cooldown.commandCheck(userlow))
  }

  // Keywords

  if (userlow === 'xenoplopqb' && message.includes('modCheck') && channel === 'darkvypr' && !cooldown.commandCheck(userlow)) {
    client.privmsg(channel, `modCheck`)
    if (userlow != 'darkvypr') {
      cooldown.addToCooldown(userlow, 3000)
    }
  }

  if (/\bNaN\b/i.test(message) && userlow !== 'vyprbot' && channel === 'darkvypr' && !cooldown.commandCheck(userlow)) {
    client.privmsg(channel, `NaN`)
    if (userlow != 'darkvypr') {
      cooldown.addToCooldown(userlow, 3000)
    }
  }

  if (/\b(unhandled)?\s?promise\s?rejection\b/i.test(message) && userlow !== 'vyprbot' && channel === 'darkvypr' && !cooldown.commandCheck(userlow)) {
    client.privmsg(channel, `js`)
    if (userlow != 'darkvypr') {
      cooldown.addToCooldown(userlow, 3000)
    }
  }

  if (/@?vyprbot,?\sprefix(\?)?/i.test(message) && !cooldown.commandCheck(userlow)) {
    client.me(channel, `${user} --> The prefix for this channel is: "${prefix.trim()}"`)
    if (userlow != 'darkvypr') {
      cooldown.addToCooldown(userlow, 3000)
    }
  }

  if (message.startsWith('!ping') && !cooldown.commandCheck(userlow)) {
    client.me(channel, `${user} --> Use: "${prefix.trim()}" as the prefix for all VyprBot commands in this channel. Example: "${prefix}ping".`)
    if (userlow != 'darkvypr') {
      cooldown.addToCooldown(userlow, 3000)
    }
  }

  if (message.startsWith('!ping') && !cooldown.commandCheck(userlow)) {
    client.me(channel, `${user} --> Use: "${prefix.trim()}" as the prefix for all VyprBot commands in this channel. Example: "${prefix}ping".`)
    if (userlow != 'darkvypr') {
      cooldown.addToCooldown(userlow, 3000)
    }
  }
  
  if (msg.channelID == '424993941' && /asd/i.test(message)) {
    let emotes = await utils.getSTV(channel)
    emotes = utils.randArrayElement(emotes)
    client.me(channel, `${emotes} ${emotes} ${emotes} ${emotes} ${emotes}`)
  }

  if (!message.startsWith(prefix) || userlow === 'vyprbot') {
    return
  }

  // Process Messages

  let [command, ...args] = message.slice(prefix.length).split(/ +/g)
  command = command.toLowerCase()

  // Message Context

  let context = {
    user: msg.senderUsername,
    display: msg.displayName,
    channel: msg.channelName,
    prefix: prefix,
    command: command,
    message: msg.messageText.replace(' 󠀀', ''),
    isAction: msg.isAction,
    uid: msg.senderUserID,
    channelUID: msg.channelID,
    colour: msg.colorRaw,
    emotes: msg.emotes,
    flags: msg.flags,
    messageID: msg.messageID,
    mod: msg.isMod,
    serverTime: msg.serverTimestamp,
    args: args
  }

  // Command

  if (command && !cooldown.commandCheck(userlow)) {
    let response = await handler(command, client, context)
    if (!response) {
      return
    }
    sendReply(response.reply)
  }
})

// API

app.listen(8080, () => {
  console.log("API online!")
})

app.get("/nammers", async (req, res) => {
  if (!req.query.user) {
    return res.status(400).send({
      statusCode: 400,
      error: `No user provided.`
    })
  }
  const user = req.query.user.toLowerCase().replace(/@/g, '')
  let nammers = await utils.getData(`${user}Nammers`)
  if (!nammers || nammers == 'null') {
    return res.status(404).send({
      statusCode: 404,
      error: `No user found.`
    })
  }
  let response = {
    statusCode: 200,
    user: user,
    date: new Date().toISOString(),
    nammers: +nammers
  }
  return res.status(200).send(response)
})