import utils from '../utils'

module.exports = async (client, context) => {
	if (!context.args[0]) {
		return {
			success: false,
			reply: "Please provide a phrase to look up!"
		}
	}
	const phraseCheck = context.args.join(' ').match(/index(:|=)(\d+)/i)
	var index = phraseCheck ? +phraseCheck[2] : 0;
	if (phraseCheck) {
		context.args.splice(context.args.indexOf(phraseCheck[0]), 1)
	}
	let urbanResult = await utils.fetch(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(context.args.join(' '))}`, {
		timeout: 10000
	})
	urbanResult = urbanResult.list
	if (urbanResult.length == 0) {
		return {
			success: false,
			reply: "Urban Dictionary does not have a definition for that word!"
		}
	}
	if (index > urbanResult.length - 1) {
		return {
			success: false,
			reply: `The definition index you specified is larger than the amount of results. Please use an index less than or equal to ${urbanResult.length - 1}.`
		}
	}
	let [cleanDef, cleanExample] = [urbanResult[index].definition.replace(/\[|\]/gim, '').replace(/n:/, '').replace(/\"\r\n\r\n/gim, ' ').replace(/\b\\b/gim, '').replace(/(\r\n|\n|\r)/gim, " "), urbanResult[index].example.replace(/\[|\]/gim, '').replace(/\"\r\n\r\n/gim, ' ').replace(/\b\\b/gim, '').replace(/(\r\n|\n|\r)/gim, " ")]
	return {
		success: true,
		reply: `(${urbanResult.length - index - 1} other definitions) (${urbanResult[index].thumbs_up} upvotes) - ${cleanDef} - Example: ${cleanExample}`
	}
}