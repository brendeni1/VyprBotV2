import utils from '../utils'
import cooldown from '../cooldown'

module.exports = async (client, context) => {
	if (cooldown.cdrCheck(context.user)) {
		return {
			success: false,
			reply: `Your CDR is on cooldown! Wait 2 hours in between resetting.`
		}
	}
	if (!cooldown.huntCheck(context.user)) {
		return {
			success: false,
			reply: `Your hunt is not on cooldown! Use: "${context.prefix}hunt" first.`
		}
	}
	let nammers = await utils.getData(`${context.user}Nammers`)
	if (nammers == null || +nammers < 10) {
		const determiner = nammers ? 'enough' : 'any'
		const amountString = nammers == null ? '' : `| You have ${nammers}, and need at least 10.`
		return {
			success: false,
			reply: `You don't have ${determiner} nammers! Use "${context.prefix}hunt" to get some. ${amountString}`
		}
	}
	cooldown.huntDelete(context.user)
	cooldown.cdrAdd(context.user);
	setTimeout(() => {
		cooldown.cdrDelete(context.user)
	}, 7200000)
	await utils.setData(`${context.user}Nammers`, +nammers - 10)
	return {
		success: true,
		reply: `Your cooldown has been reset! (-10 nammers) | You now have ${+nammers - 10} nammer(s). | Good luck! NekoPray (2 hr cooldown).`
	}
}