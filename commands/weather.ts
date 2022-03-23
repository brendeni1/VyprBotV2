import utils from '../utils'

module.exports = async (client, context) => {
  try {
    const hourCheck = context.args.join(' ').match(/hour(\+)(\d+)/i)
    const hour = hourCheck ? +hourCheck[2] - 1 : null
    if (hourCheck) {
      context.args.splice(context.args.indexOf(hourCheck[0]), 1)
    }
    if (hour && hour > 48) {
      return {
        success: false,
        reply: `You can only look up to 48 hours into the forecast. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'NOIDONTTHINKSO', 'FeelsDankMan', '😵', '😵‍💫'])}`
      }
    }
    if (hour && hour < 0) {
      return {
        success: false,
        reply: `Weather history is not currently supported! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'NOIDONTTHINKSO', 'FeelsDankMan', '😵', '⬅️⛔'])}`
      }
    }
    var location
    var address
    if (context.args[0] == 'null') {
      return {
        success: false,
        reply: `You can't use a null location! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'NOPERS', 'FeelsDankMan', '😐', '😵‍💫'])}`
      }
    }
    if (!context.args[0]) {
      address = {
        pronoun: 'You',
        determiner: 'your'
      }
      location = encodeURIComponent(await utils.getData(`${context.user}Location`))
    } else if (context.args[0].startsWith('@')) {
      address = {
        pronoun: 'They',
        determiner: 'their'
      }
      location = encodeURIComponent(await utils.getData(`${context.args[0].toLowerCase().replace('@', '')}Location`))
    } else {
      location = encodeURIComponent(context.args.join(' '))
    }
    if (!location || location == 'null') {
      return {
        success: false,
        reply: `${address.pronoun} don't have a location set! Set it with: "${context.prefix}set location {location}". ${await utils.bestEmote(context.channel, ['BRUHMM', 'WatChuSay', 'FeelsDankMan', 'KannaHmm', 'NOIDONTTHINKSO', '👆', '⛔'])}`
      }
    }
    const coordinates = await utils.fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${location}&apiKey=${process.env['GEOCODING_KEY']}`)
    if (!coordinates.items[0]) {
      return {
        success: false,
        reply: `The location provided to the API was invalid. ${await utils.bestEmote(context.channel, ['BRUHMM', 'WatChuSay', 'KannaHmm', 'FeelsDankMan', 'NOIDONTTHINKSO', '👆', '⛔'])}`
      }
    }
    location = coordinates.items[0].title
    let [latitude, longitude] = [coordinates.items[0].position.lat, coordinates.items[0].position.lng]
    let weather = await utils.fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=daily&units=metric&appid=${process.env['WEATHER_KEY']}`)
    let alerts = weather.alerts
    weather = hourCheck ? weather.hourly[hour] : weather.current
    let [condition, icon, description] = [weather.weather[0].main, weather.weather[0].icon, weather.weather[0].description]
    let [celcius, fahrenheit] = [(+weather.temp).toFixed(1), (+weather.temp * 1.8 + 32).toFixed(1)]
    let [feelsLikeCelcius, feelsLikeFahrenheit] = [(+weather.feels_like).toFixed(1), (+weather.feels_like * 1.8 + 32).toFixed(1)]
    let [windSpeed, windGust] = [(+weather.wind_speed * 3.6).toFixed(1), (+weather.wind_gust * 3.6).toFixed(1)]
    let [humidity, clouds] = [+weather.humidity, +weather.clouds]
    let [sunrise, sunset, currentTime, timeOffset] = [new Date(+weather.sunrise * 1000), new Date(+weather.sunset * 1000), new Date(), hourCheck ? `(+${hour + 1} hour${hour > 1 ? 's' : ''})` : '(Now)']
    let alertArray = []
    if (alerts) {
      alerts.forEach(alert => {
        alertArray.push(alert.tags[0] ? alert.tags.join(', ') : alert.event)
      })
      if(alerts[0].event == 'weather' && /rain(fall)?/.test(alerts[0].description)) {
        alertArray.push('Flood')
      }
    }
    if (!alerts) {
      alertArray.push('(None)')
    }
    windGust = isNaN(windGust) ? 'No wind gust data. 💨' : `with wind gusts of up to ${windGust} km/h. 💨`
    let precipitation = () => {
      if (!weather.rain && !weather.snow) {
        return ''
      } else if (weather.rain && weather.snow) {
        return `It's raining at a rate of ${weather.rain['1h']} mm/hr, and snowing at a rate of ${weather.snow['1h']} mm/hr. 🌧️🌨️`
      } else if (weather.rain && !weather.snow) {
        return `It's raining at a rate of ${weather.rain['1h']} mm/hr. ☔ 🌧️`
      } else {
        return `It's snowing at a rate of ${weather.snow['1h']} mm/hr. ☔ 🌧️`
      }
    }
    let conditionString = () => {
      switch (condition) {
        case 'Clear':
          return 'with clear skies. ☀️ ⛱️'
          break
        case 'Thunderstorm':
          return `with a ${description}. ⛈️ ☔`
          break
        case 'Drizzle':
          return 'with slight rain. 🌦️ 🌧️'
          break
        case 'Rain':
          return `with ${description}. 🌧️ ☔`
          break
        case 'Snow':
          return `with ${description}. 🌨️ ❄️`
          break
        case 'Clouds':
          return `with ${description}. ☁️ 🌥️`
          break
        default:
          return `with a special weather event: ${condition}. 📊 🔍`
      }
    }
    let sunState = () => {
      if (currentTime < sunrise) {
        let sunriseIn = utils.formatDelta(sunrise)
        return `Sun rises in ${sunriseIn}. 🌅`
      } else if (currentTime < sunset) {
        let sunsetIn = utils.formatDelta(sunset)
        return `Sun sets in ${sunsetIn}. 🌇`
      } else {
        let sunriseIn = utils.formatDelta(utils.addHours(sunrise, 24))
        return `Sun rises in ${sunriseIn}. 🌅`
      }
    }
    let weatherObj = {
      success: true,
      location: location,
      temp: {
        c: celcius + '°C',
        f: fahrenheit + '°F',
        fC: feelsLikeCelcius + '°C',
        fF: feelsLikeFahrenheit + '°F'
      },
      precipitation: precipitation(),
      wind: {
        speed: windSpeed + ' km/h',
        gust: windGust
      },
      sun: sunState(),
      humidity: humidity + '% 💧',
      condition: conditionString(),
      clouds: clouds + '% ☁️',
      weatherAlert: alertArray.join(', ')
    }
    return {
      success: true,
      reply: `${weatherObj.location} ${timeOffset} ${weatherObj.temp.c} (${weatherObj.temp.f}) feels like ${weatherObj.temp.fC} (${weatherObj.temp.fF}) ${weatherObj.condition} ${weatherObj.precipitation} The wind speed is ${weatherObj.wind.speed}, ${weatherObj.wind.gust} ${!hour && hour != 0 ? weatherObj.sun : ''} Humidity: ${weatherObj.humidity} Cloud Coverage: ${weatherObj.clouds} Alert: ${weatherObj.weatherAlert} ⚠️`
    }
  } catch (e) {
    return {
      success: false,
      reply: `Report this error with "${context.prefix}suggest"! ${e}`
    }
  }
}