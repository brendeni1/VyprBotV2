import utils from '../utils'

module.exports = async (client, context) => {
  const quote = await utils.fetch(`https://api.kanye.rest/`)
  return { success: true, reply: quote.quote }
}