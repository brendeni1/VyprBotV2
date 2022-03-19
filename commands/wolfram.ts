import utils from '../utils'

module.exports = async (client, context) => {
	if (!context.args[0]) {
		return {
			success: false,
			reply: `Provide a question for Wolfram|Alpha.`
		}
	}
	try {
		const queryData = await utils.fetch(`https://api.wolframalpha.com/v1/result?i=${context.args.join(' ')}&appid=${process.env['WOLFRAM_KEY']}`, undefined, 'text')
		return {
			success: true,
			reply: queryData
		}
	} catch (e) {
		return {
			success: false,
			reply: `Wolfram|Alpha did not understand your question!`
		}
	}
}