import utils from '../utils'

module.exports = async (client, context) => {
  const outcomes = ['Heads! (Yes)', 'Tails! (No)']
  return { success: true, reply: utils.randArrayElement(outcomes) }
}