import utils from '../utils'

module.exports = async (client, context) => {
	try {
		const optionCheck = context.args.join(' ').match(/(to|from)(=|:)(\S+)/i)
		if (!optionCheck) {
			return {
				success: false,
				reply: `Please provide a method to transform the text. Examples: "${context.prefix}text hello%20darkvypr from:uri" or "${context.prefix}text test1234 to:base64" ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
			}
		}
		const [option, method] = [optionCheck[3], optionCheck[1]]
		context.args.splice(context.args.indexOf(optionCheck[0]), 1)
		if (!context.args[0]) {
			return {
				success: false,
				reply: `Please provide text to convert. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
			}
		}
		const options = ['base64', 'b64', 'binary', 'bin', 'weeb', 'space', 'condensed', 'upper', 'lower', 'capitalize', 'capital', 'shuffle']
		if (options.indexOf(option) == -1) {
			return {
				success: false,
				reply: `Please provide a valid option to convert. Options: "${options.join(', ')}" ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
			}
		}
		const [input, inputArray] = [context.args.join(' '), context.args]
		var convertedText
		if (option == 'base64' || option == 'b64') {
			convertedText = method == 'to' ? btoa(input) :
				atob(input)
		}
		if (option == 'binary' || option == 'bin') {
			convertedText = method == 'to' ? input.split('').map((each) => each.charCodeAt(0).toString(2)).join(" ") :
				inputArray.map(elem => String.fromCharCode(parseInt(elem, 2))).join("")
		}
		if (option == 'weeb') {
			const weebFaces = ['(✿◠‿◠)', '✌.ʕʘ‿ʘʔ.✌', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', '(●´ω｀●)', 'ôヮô', '(づ｡◕‿‿◕｡)づ']
			convertedText = method == 'to' ? (input.replace(/r|l/gi, 'w').replace(/do\b/gi, 'dow').replace(/t\b/gi, 'tu~')) + `~ ${utils.randArrayElement(weebFaces)}` :
				`This command is not reversible. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
		if (option == 'space') {
			const text = input.replace(/\s/g, '').split('')
			convertedText = method == 'to' ? text.join(' ') : `This command is not reversible. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
		if (option == 'condensed') {
			convertedText = method == 'to' ? input.replace(/\s/g, '') : `This command is not reversible. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
		if (option == 'upper') {
			convertedText = method == 'to' ? input.toUpperCase() : `Use to:lower to turn a string lower case. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
		if (option == 'lower') {
			convertedText = method == 'to' ? input.toLowerCase() : `Use to:upper to turn a string upper case.`
		}
		if (option == 'capitalize' || option == 'capital') {
			convertedText = method == 'to' ? utils.capitalizeEachWord(input) : `Use to:upper or to:lower to convert cases.`
		}
		if (option == 'shuffle') {
			convertedText = method == 'to' ? inputArray.sort((a, b) => 0.5 - Math.random()).join(' ') : `This command is not reversible.`
		}
		return {
			success: true,
			reply: convertedText
		}
	} catch (e) {
		return {
			success: false,
			reply: e
		}
	}
}