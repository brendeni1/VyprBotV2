import utils from '../utils'
import cooldown from '../cooldown'

module.exports = async (client, context) => {
	if (cooldown.huntCheck(context.user)) {
		return {
			success: false,
			reply: `You're on cooldown! Wait 1 hour in between hunting. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	let [nammers, amount] = [await utils.getData(`${context.user}Nammers`), utils.randIntNeg(15, 50)]
	if (nammers == null) {
		await utils.setData(`${context.user}Nammers`, 50)
		cooldown.huntAdd(context.user);
		setTimeout(() => {
			cooldown.huntDelete(context.user)
		}, 3600000)
		return {
			success: true,
			reply: `You're a new user! Here's 50 nammers to get you started! You now have 50 nammers.`
		}
	}
	nammers = +nammers
	const message = amount >= 50 ? `You take control of a city full of nammers, and send all ${amount} of its citizens to your prison.🏙️` :
		amount >= 40 ? `You raid Chaz, a police-free autonomous zone, and return with ${amount} nammers.🚧` :
		amount >= 30 ? `You visit a village of nammers, and come out with ${amount}.🛖` :
		amount >= 20 ? `You raid a local restaurant, and find ${amount} nammers.🍕` :
		amount >= 10 ? `You enter a small hut, and find a group of ${amount} nammers.👥` :
		amount > 0 ? `You find and capture a small huddle of ${amount} nammer(s).👤` :
		amount == 0 ? `You didn't find any nammers, better luck next time. PoroSad` :
		`You leave the prison gates cracked open, and ${amount * -1} nammer(s) unknowingly escape! PANIC`
	if (nammers + amount < 0) {
		await utils.setData(`${context.user}Nammers`, 0)
		cooldown.huntAdd(context.user);
		setTimeout(() => {
			cooldown.huntDelete(context.user)
		}, 3600000)
		return {
			success: true,
			reply: `${message} | You have 0 nammers.`
		}
	}
	await utils.setData(`${context.user}Nammers`, nammers + amount)
	cooldown.huntAdd(context.user);
	setTimeout(() => {
		cooldown.huntDelete(context.user)
	}, 3600000)
	return {
		success: true,
		reply: `${message} | You have ${nammers + amount} nammers. ${await utils.bestEmote(context.channel, ['NOTED', 'Tasty', 'YESIDOTHINKSO', 'KannaSip', 'catJam', '😎', '👌'])}`
	}
}