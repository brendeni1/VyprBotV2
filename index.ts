// require("http").createServer((_, res) => res.end("Alive!")).listen(8080)
import fs from 'fs-extra'
import handler from './commands/handler'
import cooldown from './cooldown'
import utils from './utils'
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
});
const channelOptions = fs.readFileSync('./db/channels.txt').toString().split(' ')

client.connect();
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

  // Global Pings

  let globalPing = /\b(v|b)ypa(')?(s)?\b/i.test(message) || /(bright|dark)?(v|b)(y)p(e|u|o)?r/i.test(message) || /\b(dv(')?(s)?)\b/i.test(message) || /vpyr/i.test(message) || /\b(b|v)o?ip(o*|u)r\b/i.test(message) || /\b(bright|dark)vip(e|u|o)r\b/i.test(message) || /\b(b|v)ip(o|u)r\b/i.test(message) || /\b(b|v)pe?r\b/i.test(message) || /darkv/i.test(message) || /\b(dark|bright)?\s?dype?(r|a)\b/i.test(message) || /\b(b|v)ooper\b/i.test(message) || /(dark|bright)\s?diaper/i.test(message) || /(dark|bright)\s?viper|vypr/i.test(message)
  const blacklistedChannels = new RegExp(/visioisiv|darkvypr|vyprbottesting|vyprbot/)
  const blacklistedUsers = new RegExp(/darkvypr|vyprbot|vyprbottesting|hhharrisonnnbot|apulxd|daumenbot|kuharabot|snappingbot|oura_bot/)

  if (globalPing && !blacklistedChannels.test(channel) && !blacklistedUsers.test(userlow)) {
    client.whisper('darkvypr', `Channel: #${channel} | User: ${userlow} | Message: ${message}`)
  }

  // Prefix

  let prefix
  try {
    prefix = await utils.getData(`${channel}Prefix`) ?? 'vb '
  } catch (e) {
    client.me(channel, `${user} --> Replit is shit, re-execute that command please!`)
  }

  // Keywords

  if (userlow === 'xenoplopqb' && message.includes('modCheck') && channel === 'darkvypr') {
    client.privmsg(channel, `modCheck`)
  }

  if (/NaN/.test(message) && userlow !== 'vyprbot' && channel === 'darkvypr') {
    client.privmsg(channel, `NaN`)
  }

  if (/\bunhandled\s?promise\s?rejection\b/i.test(message) && userlow !== 'vyprbot' && channel === 'darkvypr') {
    client.privmsg(channel, `js`)
  }

  if (/@?vyprbot,?\sprefix(\?)?/i.test(message)) {
    client.me(channel, `${user} --> The prefix for this channel is: "${prefix.trim()}"`)
  }

  let didAliCallMe12YearsOld = /(you(')?(r)?(e)?)\s(all)?\s(12)/i.test(message) || /(dark)?(v|b)yp(r|a)\s(is|=)\s12((year(s)?|yr(s)))?(old)?/i.test(message) || /(ur)(\sall)?\s12/i.test(message) || /(you|u)\sguys\s(are|are\sall|=)\s12/i.test(message)

  if (didAliCallMe12YearsOld && userlow === 'ali2465') {
    let ali12 = +await utils.getData('vypais12') + 1
    client.me(channel, `Vypr has been called a 12 year old ${ali12} times. PANIC`)
    utils.setData('vypais12', ali12)
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

  // Check And Send The Message 

  let sendReply = (reply) => {
    try {
      reply = String(reply)
      let regex = new RegExp(process.env.BAD_WORD_REGEX)
      reply = regex.test(reply) ? `panicBasket Bad Word Detected panicBasket` : `${user} --> ${reply.replace(/\n|\r/gim, '')}`
      reply = reply.length > 490 ? reply.slice(0, 490) + "..." : reply
      client.me(channel, reply)
    } catch (e) {
      client.me(channel, `${user} --> ${e}`)
    }
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