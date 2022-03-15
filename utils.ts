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
  scopes: []
});

const formatDelta = (date) => {
  return humanizeDuration(new Date(date) - new Date(), { round: true, largest: 2 })
}
exports.formatDelta = formatDelta

const formatTime = (date) => {
  return humanizeDuration(date, { round: true, largest: 2 })
}
exports.formatTime = formatTime

const delta = (date) => {
  return new Date(date) - new Date()
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
  const response = await nodeFetch(url, headers)
  if (!response.ok) {
    throw `Error: ${response.statusText}`
  }
  return await response[format]()
}
exports.fetch = fetch

const fetchPost = async (url, headers, body) => {
  post = await nodeFetch(url, { method: 'POST' })
  return await post.json()
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