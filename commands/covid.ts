import utils from '../utils'

module.exports = async (client, context) => {
	var location
	var address
	if (!context.args[0]) {
		address = {
			pronoun: 'You',
			determiner: 'your'
		};
		location = encodeURIComponent(await utils.getData(`${context.user}Location`))
	} else if (context.args[0].startsWith('@')) {
		address = {
			pronoun: 'They',
			determiner: 'their'
		};
		location = encodeURIComponent(await utils.getData(`${context.args[0].toLowerCase().replace('@', '')}Location`))
	} else {
		location = encodeURIComponent(context.args.join(' '))
	}
	if (!location || location == 'null') {
		return {
			success: false,
			reply: `${address.pronoun} don't have a location set! Set it with: "${context.prefix}set location {location}"`
		}
	}
	try {
		const locationData = await utils.fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${location}&apiKey=${process.env['GEOCODING_KEY']}`)
		if (!locationData.items[0]) {
			return {
				success: false,
				reply: `The location provided to the geocoding API was invalid.`
			}
		}
		const country = locationData.items[0].address.countryCode
		const covidStats = await utils.fetch(`https://coronavirus-monitor-v2.p.rapidapi.com/coronavirus/latest_stat_by_country.php?country=${country}`, {
			"headers": {
				"x-rapidapi-host": "coronavirus-monitor-v2.p.rapidapi.com",
				"x-rapidapi-key": process.env['COVID_KEY']
			}
		})
		return {
			success: true,
			reply: `COVID-19 stats for ${covidStats.country} (Updated: ${utils.formatDelta(covidStats.latest_stat_by_country[0].record_date)} ago) | Total Cases: ${covidStats.latest_stat_by_country[0].total_cases} | Total Deaths: ${covidStats.latest_stat_by_country[0].total_deaths} | Total Recoveries: ${covidStats.latest_stat_by_country[0].total_recovered} | New Cases: ${covidStats.latest_stat_by_country[0].new_cases} | New Deaths: ${covidStats.latest_stat_by_country[0].new_deaths} | Critical Condition: ${covidStats.latest_stat_by_country[0].serious_critical} | Total Tested: ${covidStats.latest_stat_by_country[0].total_tests}`
		}
	} catch (e) {
		return {
			success: false,
			reply: `There was an error getting the COVID-19 data! The country is most likely invalid/not tracked.`
		}
	}
}