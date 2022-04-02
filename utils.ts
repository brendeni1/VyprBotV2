import fs from 'fs-extra'
import TwitchApi from "node-twitch"
import humanizeDuration from "humanize-duration"
import { performance } from 'perf_hooks'
const nodeFetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
import dateFormat, { masks } from "dateformat"
import isoConv from 'iso-language-converter'
import Database from "@replit/database"
const db = new Database()

const twitch = new TwitchApi({
  client_id: process.env.TWITCH_CLIENT_ID,
  client_secret: process.env.TWITCH_CLIENT_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  scopes: ['channel:read:subscriptions']
});

const formatDelta = (date) => {
  return humanizeDuration(new Date(date) - new Date(), { round: true, largest: 2 })
}
exports.formatDelta = formatDelta

const formatTime = (date) => {
  return humanizeDuration(date, { round: true, largest: 2 })
}
exports.formatTime = formatTime

const delta = (date, date2) => {
  date2 = date2 ? new Date(date2) : new Date()
  return new Date(date) - date2
}
exports.delta = delta

const getData = async (key) => {
  return await db.get(key)
}
exports.getData = getData

const setData = async (key, value) => {
  await db.set(key, value)
  return
}
exports.setData = setData

const deleteData = async (key) => {
  await db.delete(key)
  return
}
exports.deleteData = deleteData

const listData = async (prefix) => {
  return await db.list(prefix)
}
exports.listData = listData

const fetch = async (url, headers, format) => {
  format = format ? format : 'json'
  headers = headers ? headers : { method: 'GET' }
  const response = await nodeFetch(url, { headers: headers })
  if (!response.ok) {
    throw `Error: ${response.statusText}`
  }
  return await response[format]()
}
exports.fetch = fetch

const fetchPost = async (url, format, headers) => {
  format = format ? format : 'json'
  headers = headers ? headers : { method: 'POST' }
  const response = await nodeFetch(url, headers)
  if (!response.ok) {
    throw `Error: ${response.statusText}`
  }
  return await response[format]()
}
exports.fetchPost = fetchPost

const formatDate = (date, options) => {
  return dateFormat(new Date(date), options)
}
exports.formatDate = formatDate

const addHours = (date, hours) => {
  date = new Date(date)
  return new Date(date.setHours(date.getHours() + hours))
}
exports.addHours = addHours

const checkAdmin = async (user) => {
  const admins = (await db.get('admins')).toString().split(' ')
  return admins.indexOf(user) != -1
}
exports.checkAdmin = checkAdmin

const checkPermitted = async (context) => {
  if (context.user == context.channel) { return true }
  let permits = await db.get(`${context.channel}Permits`)
  if (!permits) { return false }
  return permits.indexOf(context.user) != -1
}
exports.checkPermitted = checkPermitted

const getChannels = () => {
  return fs.readFileSync('db/channels.txt').toString().split(' ')
}
exports.getChannels = getChannels

const randInt = (min, max) => {
  return Math.floor(Math.random() * (+max + 1 - min)) + min
}
exports.randInt = randInt

const randIntNeg = (min, max) => {
  return Math.floor(Math.random() * (max + min)) - min
}
exports.randIntNeg = randIntNeg

const randArrayElement = (array) => {
  const number = Math.floor(Math.random() * array.length)
  return array[number]
}
exports.randArrayElement = randArrayElement

const capitalizeEachWord = (str) => {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ')
}
exports.capitalizeEachWord = capitalizeEachWord

const streamDetails = async (channel) => {
  return await twitch.getStreams({ channel: channel })
}
exports.streamDetails = streamDetails

const topGames = async () => {
  return twitch.getTopGames()
}
exports.topGames = topGames

const topStreams = async () => {
  return await twitch.getStreams()
}
exports.topStreams = topStreams

const userExists = async (user) => {
  try {
    await fetch(`https://api.ivr.fi/v2/twitch/user/${user}`)
    return true
  } catch (e) {
    return false
  }
}
exports.userExists = userExists

const bestEmote = async (channel, choices) => {
  if(!Array.isArray(choices)) {
    throw 'Emote choices must be an array! Format: "utils.bestEmote(channel, [choices])"'
  }
  if(choices.length < 2) {
    throw 'Choices must be an array that has at least 2 elements! Format: "utils.bestEmote(channel, [choices])"'
  }
  try {
    const channelData = await fetch(`https://api.ivr.fi/v2/twitch/user/${channel}`)
    let ffzEmotes = await nodeFetch(`https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${channelData.id}`)
    if(!ffzEmotes.ok) {
      ffzEmotes = null
    }
    let bttvEmotes = await nodeFetch(`https://api.betterttv.net/3/cached/users/twitch/${channelData.id}`)
    if(!bttvEmotes.ok) {
      bttvEmotes = null
    }
    let sevenTVEmotes = await nodeFetch(`https://api.7tv.app/v2/users/${channel}/emotes`)
    if(!sevenTVEmotes.ok) {
      sevenTVEmotes = null
    }
    if(!ffzEmotes && !bttvEmotes && !sevenTVEmotes) {
      const emojiCheck = choices.join().match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi)
      return emojiCheck ? randArrayElement(emojiCheck) : ''
    }
    if (ffzEmotes) {
      ffzEmotes = await ffzEmotes.json()
    }
    if (bttvEmotes) {
      bttvEmotes = await bttvEmotes.json()
      bttvEmotes = bttvEmotes.sharedEmotes.concat(bttvEmotes.channelEmotes)
    }
    if (sevenTVEmotes) {
      sevenTVEmotes = await sevenTVEmotes.json()
    }
    
    let ffzEmotesArray = ffzEmotes ? ffzEmotes.map(emotes => {
      return emotes.code
    })
    : []
    let bttvEmotesArray = bttvEmotes ? bttvEmotes.map(emotes => {
      return emotes.code
    })
    : []
    let sevenTVEmotesArray = sevenTVEmotes ? sevenTVEmotes.map(emotes => {
      return emotes.name
    })
    : []
    let addedEmotes = []
    ffzEmotes ? addedEmotes.push(ffzEmotesArray) : null
    bttvEmotes ? addedEmotes.push(bttvEmotesArray) : null
    sevenTVEmotes ? addedEmotes.push(sevenTVEmotesArray) : null
    addedEmotes = addedEmotes.flat()
    let matches = addedEmotes.filter(emote => {
      return choices.includes(emote)
    })
    if(!matches[0]) {
      const globals = [":tf:", "AngelThump", "ariW", "BroBalt", "bttvNice", "bUrself", "CandianRage", "CiGrip", "ConcernDoge", "cvHazmat", "cvL", "cvMask", "cvR", "D:", "DatSauce", "DogChamp", "DuckerZ", "FeelsAmazingMan", "FeelsBadMan", "FeelsBirthdayMan", "FeelsGoodMan", "FeelsSnowMan", "FeelsSnowyMan", "FireSpeed", "FishMoley", "ForeverAlone", "GabeN", "haHAA", "HailHelix", "Hhhehehe", "IceCold", "KappaCool", "KaRappa", "KKona", "LuL", "monkaS", "NaM", "notsquishY", "PoleDoge", "RarePepe", "RonSmug", "SaltyCorn", "ShoopDaWhoop", "SoSnowy", "SourPls", "SqShy", "TaxiBro", "TwaT", "VapeNation", "VisLaud", "WatChuSay", "Wowee", "WubTF", "AndKnuckles", "BeanieHipster", "BORT", "CatBag", "LaterSooner", "LilZ", "ManChicken", "OBOY", "OiMinna", "YooHoo", "ZliL", "ZrehplaR", "ZreknarF"]
      matches = globals.filter(emote => {
        return choices.includes(emote)
      })
    }
    if(!matches[0]) {
      const emojiCheck = choices.join().match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi)
      return emojiCheck ? randArrayElement(emojiCheck) : ''
    }
    return randArrayElement(matches)
  } catch (e) {
    throw e
  }
}
exports.bestEmote = bestEmote

const getChannelEmotes = async (channel) => {
  if(!channel) {
    throw 'Please report this error with: "vb suggest *get all channel emotes error, missing channel*"!'
  }
  try {
    const channelData = await fetch(`https://api.ivr.fi/v2/twitch/user/${channel}`)
    let ffzEmotes = await nodeFetch(`https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${channelData.id}`)
    if(!ffzEmotes.ok) {
      ffzEmotes = null
    }
    let bttvEmotes = await nodeFetch(`https://api.betterttv.net/3/cached/users/twitch/${channelData.id}`)
    if(!bttvEmotes.ok) {
      bttvEmotes = null
    }
    let sevenTVEmotes = await nodeFetch(`https://api.7tv.app/v2/users/${channel}/emotes`)
    if(!sevenTVEmotes.ok) {
      sevenTVEmotes = null
    }
    if(!ffzEmotes && !bttvEmotes && !sevenTVEmotes) {
      return null
    }
    if (ffzEmotes) {
      ffzEmotes = await ffzEmotes.json()
    }
    if (bttvEmotes) {
      bttvEmotes = await bttvEmotes.json()
      bttvEmotes = bttvEmotes.sharedEmotes.concat(bttvEmotes.channelEmotes)
    }
    if (sevenTVEmotes) {
      sevenTVEmotes = await sevenTVEmotes.json()
    }
    let ffzEmotesArray = ffzEmotes ? ffzEmotes.map(emotes => {
      return emotes.code
    })
    : []
    let bttvEmotesArray = bttvEmotes ? bttvEmotes.map(emotes => {
      return emotes.code
    })
    : []
    let sevenTVEmotesArray = sevenTVEmotes ? sevenTVEmotes.map(emotes => {
      return emotes.name
    })
    : []
    let addedEmotes = []
    ffzEmotes ? addedEmotes.push(ffzEmotesArray) : null
    bttvEmotes ? addedEmotes.push(bttvEmotesArray) : null
    sevenTVEmotes ? addedEmotes.push(sevenTVEmotesArray) : null
    addedEmotes = addedEmotes.flat()
    if(!addedEmotes[0]) {
      return null
    }
    return addedEmotes
  } catch (e) {
    throw e
  }
}
exports.getChannelEmotes = getChannelEmotes