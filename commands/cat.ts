import utils from '../utils'

module.exports = async (client, context) => {
  const cat = await utils.fetch('https://api.thecatapi.com/v1/images/search')
  return { success: true, reply: `Random Cat: ${cat[0].url}` }
}