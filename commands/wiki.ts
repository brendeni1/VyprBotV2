import utils from '../utils'
import wiki from 'wikipedia'

module.exports = async (client, context) => {
	if (!context.args[0]) {
		return {
			success: false,
			reply: `Please provide a word or phrase to look up!`
		}
	}
	let wikiResult = await wiki.summary(context.args.join(' '))
	return {
		success: true,
		reply: wikiResult.extract ? wikiResult.content_urls.desktop.page + ' | ' + wikiResult.extract.replace(/(\r\n|\n|\r)/gm, " ") : 'No articles found!'
	}
}