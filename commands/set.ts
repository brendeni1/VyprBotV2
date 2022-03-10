import utils from '../utils'

module.exports = async (client, context) => {
  if (!context.args[0] || !context.args[1]) { return { success: false, reply: `Invalid command syntax!. Examples: "${context.prefix}set twitter darkvyprr", "${context.prefix}set birthday 8/14/2005 (mm/dd/yyyy)", "${context.prefix}set prefix !" or "${context.prefix}set location lasalle ontario"` } }
  const [setting, value, bdayRegExp] = [context.args[0], context.args[1], new RegExp('^(?!0?2/3)(?!0?2/29/.{3}[13579])(?!0?2/29/.{2}[02468][26])(?!0?2/29/.{2}[13579][048])(?!(0?[469]|11)/31)(?!0?2/29/[13579][01345789]0{2})(?!0?2/29/[02468][1235679]0{2})(0?[1-9]|1[012])/(0?[1-9]|[12][0-9]|3[01])/([0-9]{4})$')]
  context.args.shift()
  if (setting == 'twitter') {
    let account = value.replace('@', '').toLowerCase()
    utils.setData(`${context.user}Twitter`, account)
    return { success: true, reply: `Successfully set your Twitter account to: @${account}!` }
  }
  if (setting == 'location') {
    let location = await utils.fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(context.args.join(' ')).toLowerCase()}&apiKey=${process.env['GEOCODING_KEY']}`)
    if (location.items.length == 0) { return { success: false, reply: `That location was invalid!` } }
    utils.setData(`${context.user}Location`, location.items[0].title)
    return { success: true, reply: `Successfully set your location to: ${location.items[0].title}` }
  }
  if (setting == 'bday' || setting == 'birthday') {
    if (!bdayRegExp.test(value)) { return { success: false, reply: `Invalid Date. Example: "${context.prefix}set birthday 8/14/2005 (mm/dd/yyyy)".` } }
    utils.setData(`${context.user}Birthday`, value)
    return { success: false, reply: `Successfully set your birthday to: ${utils.formatDate(value, "fullDate")}!` }
  }
  if (setting == 'prefix') {
    if (context.mod || await utils.checkAdmin(context.user) || context.channel == context.user) {
      if (/^[a-zA-Z]+$/.test(value)) { utils.setData(`${context.channel}Prefix`, `${value} `); return { success: true, reply: `Successfully set the prefix for this channel to: ${value}` } }
      utils.setData(`${context.channel}Prefix`, value)
      return { success: true, reply: `Successfully set the prefix for this channel to: ${value}` }
    }
    return { success: false, reply: `You don't have the required permission to use that command! Required: Moderator or Above.` }
  }
  if (setting == 'nammers') {
    if (await utils.checkAdmin(context.user)) {
      let [user, amount] = [context.args[0].toLowerCase().replace('@', ''), context.args[1]]
      if(!/^\d+$/.test(context.args[1])) { return { success: false, reply: `Invalid syntax! Usage: "${context.prefix}set nammers {user} {amount}"` } }
      utils.setData(`${user}Nammers`, context.args[1])
      return { success: true, reply: `Successfully set @${user}'s nammers to: ${amount}` }
    }
    return { success: false, reply: `You don't have the required permission to use that command! Required: Admin.` }
  }
  return { success: false, reply: `Invalid command syntax!. Examples: "${context.prefix}set twitter darkvyprr", "${context.prefix}set birthday 8/14/2005 (mm/dd/yyyy)", "${context.prefix}set prefix !" or "${context.prefix}set location lasalle ontario"` }
}