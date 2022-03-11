import utils from '../utils'
import fs from 'fs-extra'

module.exports = async (client, context) => {
  if (context.args[0] == 'all' && await utils.checkAdmin(context.user)) {
    let suggestions = fs.readdirSync('suggestions/active').join(', ')
    suggestions = suggestions.length == 0 ? 'None' : suggestions.replace(/.json/g, '')
    return { success: true, reply: `Active Suggestions: ${suggestions}` }
  }
  if (!context.args[0] || !/^\d+$/.test(context.args[0])) {
    return { success: false, reply: `Please provide a valid suggestion ID to check.` }
  }
  let id = +context.args[0]
  const location = await fs.exists(`suggestions/active/${id}.json`) ? 'active'
    : await fs.exists(`suggestions/approved/${id}.json`) ? 'approved'
      : await fs.exists(`suggestions/author-dismissed/${id}.json`) ? 'author-dismissed'
        : await fs.exists(`suggestions/denied/${id}.json`) ? 'denied'
          : null
  if (!location) {
    return { success: false, reply: `There is no suggestion with that id!` }
  }
  var suggestion = await fs.readJson(`suggestions/${location}/${id}.json`)
  if (suggestion.user != context.user && !await utils.checkAdmin(context.user)) {
    return { success: false, reply: `You don't own that suggestion, and can't view it!` }
  }
  const actionDetails = location == 'denied' || location == 'approved' ? suggestion.reason == '' ? `| No reason provided | Action By: ${suggestion.actionBy} |` : `| Reason: ${suggestion.reason} | Action By: ${suggestion.actionBy} |` : `|`
  return { success: true, reply: `ID: ${id} | State: ${location} | Channel Created: ${suggestion.channel} | Date Created: ${utils.formatDate(suggestion.date, "mmmm dS, yyyy ' at ' h:MM TT")} (${utils.formatDelta(suggestion.date)} ago) ${actionDetails} Suggestion: ${suggestion.suggestion}` }
}