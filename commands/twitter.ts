import utils from '../utils'

module.exports = async (client, context) => {
  var account
  var address
  if (!context.args[0]) { address = { pronoun: 'You', determiner: 'your' }; account = encodeURIComponent(await utils.getData(`${context.user}Twitter`)) }
  else if (context.args[0].startsWith('@')) { address = { pronoun: 'They', determiner: 'their' }; account = encodeURIComponent(await utils.getData(`${context.args[0].toLowerCase().replace('@', '')}Twitter`)) }
  else { account = encodeURIComponent(context.args.join(' ')) }
  if (!account || account == 'null') { return { success: false, reply: `${address.pronoun} don't have a Twitter account set! Set it with: "${context.prefix}set twitter {account}"` } }
  let tweetData = await utils.fetch(`https://decapi.me/twitter/latest/${account.toLowerCase().replace('@', '')}?include_replies=true&url=true&howlong=true`, undefined, 'text')
  return { success: false, reply: tweetData }
}