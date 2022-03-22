import utils from '../utils'

module.exports = async (client, context) => {
	const phraseCheck = context.args.join(' ').match(/index(:|=)(\d+)/i)
	const index = phraseCheck ? +phraseCheck[2] : 0;
	if (phraseCheck) {
		context.args.splice(context.args.indexOf(phraseCheck[0]), 1)
	}
	if (!context.args[0]) {
		return {
			success: false,
			reply: `Please provide a phrase or word to define! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	let definition = await utils.fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${context.args.join(' ')}?key=${process.env['DICTIONARY_KEY']}`)
	if (definition.length == 0 || !definition[0].meta) {
		return {
			success: false,
			reply: `dictionaryapi.com does not have a definition for that word! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	if (index > definition.length - 1) {
		return {
			success: false,
			reply: `The index you specified is larger than the amount of results. Please use an index less than or equal to ${definition.data.length - 1}. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	definition = definition[index]
	let meaning = definition.shortdef[0] ? definition.shortdef[0] : "No definition available."
	let [word, offensive, literaryDevice] = [definition.meta.id.replace(/:\d+/g, ''), definition.meta.offensive, definition.fl]
	return {
		success: true,
		reply: `Word: ${word} | Literary Device: ${literaryDevice} | Offensive: ${offensive} | Meaning: ${meaning}`
	}
}