import utils from '../utils'

module.exports = async (client, context) => {
  var location
  var address
  if (!context.args[0]) { address = { pronoun: 'You', determiner: 'your' }; location = encodeURIComponent(await utils.getData(`${context.user}Location`)) }
  else if (context.args[0].startsWith('@')) { address = { pronoun: 'They', determiner: 'their' }; location = encodeURIComponent(await utils.getData(`${context.args[0].toLowerCase().replace('@', '')}Location`)) }
  else { location = encodeURIComponent(context.args.join(' ')) }
  if (!location || location == 'null') { return { success: false, reply: `${address.pronoun} don't have a location set! Set it with: "${context.prefix}set location {location}"` } }
  const coordinates = await utils.fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${location}&apiKey=${process.env['GEOCODING_KEY']}`)
  if (!coordinates.items[0]) {
    return { success: false, case: 'invalid_locaiton', reply: `The location provided to the API was invalid.` }
  }
  location = coordinates.items[0].title
  var [latitude, longitude] = [coordinates.items[0].position.lat, coordinates.items[0].position.lng]
  let time = await utils.fetch(`https://api.bigdatacloud.net/data/timezone-by-location?latitude=${latitude}&longitude=${longitude}&key=${process.env['TIME_KEY']}`)
  let [dateTime, timeZone, utcOffset, fullTimeZone] = [new Date(time.localTime).toISOString(), time.effectiveTimeZoneShort, time.utcOffset, time.displayName]
  var currentTime = {
    date: utils.formatDate(dateTime, "fullDate"),
    time: utils.formatDate(dateTime, "h:MM:ss TT"),
  }
  return {
    currentTime,
    reply: `${location} is in ${fullTimeZone}. It's currently ${currentTime.time}, ⌚ and the date is ${currentTime.date}. 📅`
  }
}