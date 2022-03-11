import utils from '../utils'

module.exports = async (client, context) => {
  let trumpQuote = await utils.fetch(`https://api.tronalddump.io/random/quote`)
  let [timeSaid, year, quote] = [utils.formatDelta(trumpQuote.appeared_at), new Date(trumpQuote.appeared_at).getFullYear(), trumpQuote.value.replace(/(\r\n|\n|\r)/gim, " ").replace(/\"\r\n\r\n/gim, ' ')]
  return { success: true, reply: `(${timeSaid} ago) "${quote}" - Trump, ${year}` }
}