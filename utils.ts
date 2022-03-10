import fs from 'fs-extra'
import humanizeDuration from "humanize-duration"
import { performance } from 'perf_hooks'
const nodeFetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
import dateFormat, { masks } from "dateformat"
import isoConv from 'iso-language-converter'
import Database from "@replit/database"
const db = new Database()

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

const fetch = async (url, headers) => {
  response = await nodeFetch(url, headers)
  response = await response.json()
  if (response.error || response.status) { throw response }
  return response
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
  return new Date(new Date(date).setHours(date.getHours() + hours))
}
exports.addHours = addHours

const checkAdmin = async (user) => {
  const admins = (await db.get('admins')).toString().split(' ')
  return admins.indexOf(user) != -1
}
exports.checkAdmin = checkAdmin

const checkPermitted = async (user, channel) => {
  const permits = (await db.get(`${channel}Permits`)).toString().split(' ')
  return permits.indexOf(user) != -1
}
exports.checkPermitted = checkPermitted

const getChannels = () => {
  return fs.readFileSync('db/channels.txt').toString().split(' ')
}
exports.getChannels = getChannels

const randInt = async (min, max) => {
  return Math.floor(Math.random() * (max - min) ) + min
}
exports.randInt = randInt

const randArrayElement = (array) => {
  const number = Math.floor(Math.random() * array.length)
  return array[number]
}
exports.randArrayElement = randArrayElement