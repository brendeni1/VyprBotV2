import utils from '../utils'

module.exports = async (client, context) => {
  const wyr = await utils.fetch(`https://would-you-rather-api.abaanshanid.repl.co/`)
  return { success: true, reply: wyr.data }
}