import utils from '../utils'
import notify from '../tools/notifier'

module.exports = async (client, context) => {
	if (!await utils.checkAdmin(context.user)) {
		return {
			success: false,
			reply: `You don't have permission to use that command! Required: Admin ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
  const options = ['add', 'delete', 'read', 'remove', 'check']
  if (!context.args[0] || !context.args[1] || options.indexOf(context.args[0]) == -1) {
    return {
      success: false,
      reply: `Invalid syntax! Correct: "${context.prefix}remind {add|delete/remove|read} {user} {body-text}"`
    }
  }
  const action = context.args[0].toLowerCase()
  const target = context.args[1].replace('@', '').toLowerCase()
  try {
    if (action == 'add') {
      context.args.splice(0, 2)
      if (!context.args[0]) {
        return {
          success: false,
          reply: `Invalid syntax! Correct: "${context.prefix}remind {add*|delete/remove|read} {user} {body-text*}"`
        }
      }
      const body = context.args.join(' ')
      let id = Number(await utils.getData('notiID'))
      await notify.add(target, `${body} - From: ${context.display}`)
      return {
        success: true,
        reply: `Successfully created reminder for @${target}! (ID: ${id})`
      }
    }
    if (action == 'delete' || action == 'remove') {
      await notify.remove(target)
      return {
        success: true,
        reply: `Successfully deleted reminder for @${target}!`
      }
    }
    if (action == 'read' || action == 'check') {
      let notis = await notify.read(target)
      return {
        success: true,
        reply: `${notis.formatted}`
      }
    }
  } catch (e) {
    return {
      success: false,
      reply: e
    }
  }
}