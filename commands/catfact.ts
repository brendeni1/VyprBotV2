import utils from '../utils'

module.exports = async (client, context) => {
  const fact = await utils.fetch(`https://catfact.ninja/fact?max_length=450`) 
  return { success: true, reply: fact.fact }
}