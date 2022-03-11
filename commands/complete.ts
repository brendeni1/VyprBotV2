import utils from '../utils'
import fs from 'fs-extra'

module.exports = async (client, context) => {
  if (!await utils.checkAdmin(context.user)) { return { success: false, reply: `You don't have permission to use that command! Required: Admin` } }
  const options = ['approved', 'denied']
  if (context.args.length < 2 || !/^\d+$/.test(context.args[0]) || options.indexOf(context.args[1]) == -1) {
    return { success: false, reply: `Invalid Syntax! Example: "${context.prefix}complete {id} {approved|denied} {optional: reason}"` }
  }
  let [id, action, reason] = [+context.args[0], context.args[1].toLowerCase(), context.args.slice(2).join(' ') ? context.args.slice(2).join(' ') : '(No reason provided!)']
  if (!await fs.exists(`suggestions/active/${id}.json`)) {
    return { success: false, reply: `There is no suggestion with that the ID: ${id} !` }
  }
  let suggestionDetails = await fs.readJson(`suggestions/active/${id}.json`)
  await fs.writeJson(`suggestions/active/${id}.json`, { user: suggestionDetails.user, actionBy: context.user, id: id, channel: suggestionDetails.channel, date: suggestionDetails.date, dateApproved: new Date().toISOString(), state: 'Approved/Finished', suggestion: suggestionDetails.suggestion, reason: reason })
  await fs.rename(`suggestions/active/${id}.json`, `suggestions/${action}/${id}.json`)
  client.whisper(suggestionDetails.user, `[Suggestion Update] Your suggestion with the ID ${suggestionDetails.id} was ${action}! Notes: ${reason}`)
  suggestionDetails.user == 'darkvypr' ? null : await utils.fetchPost(`https://supinic.com/api/bot/reminder?auth_user=${process.env['SUPI_USER_AUTH']}&auth_key=${process.env['SUPI_USERKEY_AUTH']}&username=${suggestionDetails.user}&private=true&text=[VyprBot Update] Your suggestion on VyprBot with the ID ${suggestionDetails.id} was ${action}! Notes: ${reason}`)
  return { success: true, reply: `Successfully notified @${suggestionDetails.user} and ${action} suggestion ${suggestionDetails.id}.` }
}