import utils from '../utils'

module.exports = async (client, context) => {
  let originalUser = context.user
  if (context.args[0]) { context.user = context.args[0].toLowerCase().replace('@', '') }
  if (context.user == 'vyprbot') { return { success: true, reply: `I was made on November 12, 2021 which was ${utils.formatDelta('November 12 2021')} ago.` } }
  let bday = await utils.getData(`${context.user}Birthday`)
  if (!bday) { return { success: false, reply: originalUser == context.user ? `Before using this command, you must set your birthday with the "${context.prefix}set birthday" command. It must be in M/D/YYYY or MM/DD/YYYY format. Examples: "${context.prefix}set birthday 8/14/2005", "${context.prefix}set birthday 10/16/2004" or "${context.prefix}set birthday 9/11/1973".` : `That user hasen't set their location! Get them to use: "${context.prefix}set bday {mm/dd/yyyy}" and retry this command!` } }
  let today = utils.formatDate(new Date(), 'paddedShortDate')
  let bdayCurrentYear = bday.replace(/(160[0-9]|16[1-9][0-9]|1[7-9][0-9]{2}|[2-9][0-9]{3})/, new Date().getFullYear())
  let currentage = Math.floor((new Date() - new Date(bday)) / 31556952000)
  let turningage = currentage + 1
  let birthdayDelta = new Date(bdayCurrentYear) - new Date()
  let userContext = { userAddress: originalUser == context.user ? userNoun = 'You were' : userNoun = '@' + context.user + ' was', pronoun: originalUser == context.user ? userNoun = 'you' : userNoun = 'they' }
  let [yearCase, yearCaseBday] = [birthdayDelta < 0 ? 31536000000 : 0, birthdayDelta < 0 ? 1 : 0]
  let nextBday = utils.formatTime(yearCase + birthdayDelta)
  return { success: true, reply: `${userContext.userAddress} born on ${bday}, ${userContext.pronoun} are ${currentage} years old and are turning ${turningage} on ${bday.replace(/(160[0-9]|16[1-9][0-9]|1[7-9][0-9]{2}|[2-9][0-9]{3})/, new Date().getFullYear() + yearCaseBday)} which is in ${nextBday}.` }
}