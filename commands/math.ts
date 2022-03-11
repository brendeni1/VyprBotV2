import utils from '../utils'

module.exports = async (client, context) => {
    if (!context.args[0]) { return { success: false, reply: 'Please provide an equation to evaluate. | Examples: https://i.darkvypr.com/mathjs.png' } }
    try {
      const answer = await utils.fetch(`https://api.mathjs.org/v4/?expr=${encodeURIComponent(context.args.join(''))}`)
      return { success: true, reply: `Solution: ${answer}` }
    }catch (err) {
      return { success: false, reply: `There was an error evaluating that problem. | Examples: https://i.darkvypr.com/mathjs.png | ${err}` }
    }
}