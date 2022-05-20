import utils from '../utils'

module.exports = async (client, context) => {
	const colours = ['red', 'blue', 'green', 'firebrick', 'coral', 'yellowgreen', 'orangered', 'seagreen', 'goldenrod', 'chocolate', 'cadetblue', 'dodgerblue', 'hotpink', 'blueviolet', 'springgreen']
	let colour = context.args.join('')
  console.log(colour.toLowerCase())
  if (!colour || colours.indexOf(colour.toLowerCase()) == -1) {
		return {
			success: false,
			reply: `Invalid colour! Colours: ${utils.capitalizeEachWord(colours.join(', '))} ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
  colour = colour.toLowerCase().replace(' ', '')
	let nammers = await utils.getData(`${context.user}Nammers`)
	if (!nammers || +nammers == 0) {
		return {
			success: false,
			reply: `You don't have any nammers! Use "${context.prefix}hunt" to get some. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	nammers = +nammers
	if (nammers < 200) {
		return {
			success: false,
			reply: `You don't have enough nammers! You need 200 nammers, but only have ${nammers}. Use "${context.prefix}hunt" to get some more. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
  nammers = nammers - 200
  client.privmsg(context.channel, `/color ${colour}`)
  await utils.setData(`${context.user}Nammers`, nammers)
  return {
    success: true,
    reply: `Successfully set my colour to: ${colour.toUpperCase()}. You now have ${nammers} (-200) ${await utils.bestEmote(context.channel, ['EZ', 'HYPE', 'Swagging', 'YAAAY', 'YESIDOTHINKSO', '😎', '😄'])}`
  }
}