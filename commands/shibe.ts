import utils from '../utils'

module.exports = async (client, context) => {
  const shibe = await utils.fetch(`http://shibe.online/api/shibes?count=1&httpsUrls=true`)
  return { success: true, reply: shibe }
}