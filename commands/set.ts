import utils from '../utils'
import moment from 'moment'

module.exports = async (client, context) => {
	if (!context.args[0] || !context.args[1]) {
		return {
			success: false,
			reply: `Invalid command syntax!. Examples: "${context.prefix}set twitter darkvyprr", "${context.prefix}set birthday 8/14/2005 (mm/dd/yyyy)", "${context.prefix}set prefix !" or "${context.prefix}set location lasalle ontario" ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	const [setting, value] = [context.args[0], context.args[1]]
	context.args.shift()
	if (setting == 'twitter') {
		let account = value.replace('@', '').toLowerCase()
		utils.setData(`${context.user}Twitter`, account)
		return {
			success: true,
			reply: `Successfully set your Twitter account to: @${account}!`
		}
	}
	if (setting == 'location') {
		let location = await utils.fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(context.args.join(' ')).toLowerCase()}&apiKey=${process.env['GEOCODING_KEY']}`)
		if (location.items.length == 0) {
			return {
				success: false,
				reply: `That location was invalid! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
			}
		}
		utils.setData(`${context.user}Location`, location.items[0].title)
		return {
			success: true,
			reply: `Successfully set your location to: ${location.items[0].title}`
		}
	}
	if (setting == 'bday' || setting == 'birthday') {
		try {
			var compareDate = moment(new Date(value).toISOString())
			var startDate = moment(new Date().toISOString()).subtract(90, 'years')
			var endDate = moment(new Date().toISOString()).subtract(13, 'years')
      if(!moment(value, 'MM/DD/YYYY', true).isValid()) {
				return {
					success: false,
					reply: `Invalid Date Format. Example: "${context.prefix}set birthday 08/14/2005 (mm/dd/yyyy)". ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
				}
      }
			if (!compareDate.isBetween(startDate, endDate)) {
				return {
					success: false,
					reply: `Invalid Date Range. The maximum age is 90, and the minimum age is 13. Example: "${context.prefix}set birthday 08/14/2005 (mm/dd/yyyy)". ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
				}
			}
			utils.setData(`${context.user}Birthday`, value)
			return {
				success: false,
				reply: `Successfully set your birthday to: ${utils.formatDate(value, "fullDate")}!`
			}
		} catch (e) {
			return {
				success: false,
				reply: `Invalid Date. Example: "${context.prefix}set birthday 08/14/2005 (mm/dd/yyyy)". ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
			}
		}
	}
	if (setting == 'prefix') {
		if (context.mod || await utils.checkAdmin(context.user) || context.channel == context.user) {
			if (/^[a-zA-Z]+$/.test(value)) {
				utils.setData(`${context.channel}Prefix`, `${value} `);
				return {
					success: true,
					reply: `Successfully set the prefix for this channel to: ${value}`
				}
			}
			utils.setData(`${context.channel}Prefix`, value)
			return {
				success: true,
				reply: `Successfully set the prefix for this channel to: ${value}`
			}
		}
		return {
			success: false,
			reply: `You don't have the required permission to use that command! Required: Moderator or Above. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	if (setting == 'nammers') {
		if (await utils.checkAdmin(context.user)) {
			let [user, amount] = [context.args[0].toLowerCase().replace('@', ''), context.args[1]]
			if (!/^\d+$/.test(context.args[1])) {
				return {
					success: false,
					reply: `Invalid syntax! Usage: "${context.prefix}set nammers {user} {amount}" ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
				}
			}
			utils.setData(`${user}Nammers`, context.args[1])
			return {
				success: true,
				reply: `Successfully set @${user}'s nammers to: ${amount}`
			}
		}
		return {
			success: false,
			reply: `You don't have the required permission to use that command! Required: Admin. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	return {
		success: false,
		reply: `Invalid command syntax!. Examples: "${context.prefix}set twitter darkvyprr", "${context.prefix}set birthday 8/14/2005 (mm/dd/yyyy)", "${context.prefix}set prefix !" or "${context.prefix}set location lasalle ontario" ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
	}
}