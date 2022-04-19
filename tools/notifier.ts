import utils from '../utils'
import fs from 'fs-extra'

const check = async (user) => {
  if (!user) {
    throw `Error: No user provided for notification checking.`
  }
  try {
    const fileExists = await fs.exists(`notifications/${user}.json`)
    if(fileExists) {
      let notis = await fs.readJson(`notifications/${user}.json`)
      if (!notis || !notis.notifications || !notis.notifications[0]) {
        return false
      }
      return true
    }
    return false
  } catch (e) {
    return false
  }
}
exports.check = check

const add = async (user, body) => {
  if (!user || !body) {
    throw `Error: No ${user ? 'body' : 'user'} provided for notification adding.`
  }
  if (!await fs.exists(`notifications/${user}.json`)) {
    await fs.outputJson(`notifications/${user}.json`, { notifications: [] })
  }
  let notis = await fs.readJson(`notifications/${user}.json`)
  notis = notis.notifications
  let id = Number(await utils.getData('notiID'))
  notis.push({ id: id++, date: new Date().toISOString(), body: body })
  await fs.writeJson(`notifications/${user}.json`, { notifications: notis })
  await utils.setData('notiID', id++)
  return
}
exports.add = add

const read = async (user) => {
  if (!user) {
    throw `Error: No user provided for notification reading.`
  }
  if (!await fs.exists(`notifications/${user}.json`)) {
    throw `Error: That user has no reminders.`
  }
  let notis = await fs.readJson(`notifications/${user}.json`)
  notis = notis.notifications
  if(!notis[0]) {
    throw `Error: That user has no reminders.`
  }
  const notiArray = notis.map(i => {
    return `${i.body} (ID: ${i.id} | ${utils.formatDelta(i.date)} ago)`
  })
  return {
    raw: notis,
    formatted: notiArray.join('; ')
  }
}
exports.read = read

const remove = async (user) => {
  if (!user) {
    throw `Error: No user provided for notification deleting.`
  }
  try {
    const fileExists = await fs.exists(`notifications/${user}.json`)
    if(fileExists) {
      await fs.remove(`notifications/${user}.json`)
      return
    }
    throw `Error: @${user} has no notifications.`
  } catch (e) {
    throw e
  }
}
exports.remove = remove