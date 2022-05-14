import utils from '../utils'

module.exports = async (client, context) => {
  try {
    let vin
    let address
    if (context.args[0] == 'null') {
      return {
        success: false,
        reply: `You can't use a null VIN! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'NOPERS', 'FeelsDankMan', '😐', '😵‍💫'])}`
      }
    }
    if (!context.args[0]) {
      address = {
        pronoun: 'You',
        determiner: 'your'
      }
      vin = encodeURIComponent(await utils.getData(`${context.user}VIN`))
    } else if (context.args[0].startsWith('@')) {
      if (!await utils.userExists(context.args[0].toLowerCase().replace('@', ''))) {
        return {
          success: false,
          reply: `That user doesn't exist on Twitch! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'NOPERS', 'FeelsDankMan', '😐', '😵‍💫'])}`
        }
      }
      address = {
        pronoun: 'They',
        determiner: 'their'
      }
      vin = encodeURIComponent(await utils.getData(`${context.args[0].toLowerCase().replace('@', '')}VIN`))
    } else {
      vin = encodeURIComponent(context.args.join(' '))
    }
    if (!vin || vin == 'null') {
      return {
        success: false,
        reply: `${address.pronoun} don't have a VIN set! Set it with: "${context.prefix}set vin {vin}". ${await utils.bestEmote(context.channel, ['BRUHMM', 'WatChuSay', 'FeelsDankMan', 'KannaHmm', 'NOIDONTTHINKSO', '👆', '⛔'])}`
      }
    }
    let vinDetails = await utils.fetch(`https://auto.dev/api/vin/${vin}?apikey=${process.env.VIN_KEY}`)
    if (vinDetails.status || vinDetails.errorType) {
      return {
        success: false,
        reply: `${vinDetails.message ?? '(Invalid VIN or Invalid API Call)'} ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'NOPERS', 'FeelsDankMan', '😐', '😵‍💫'])}`
      }
    }
    let {
      make, 
      model, 
      engine,
      transmission, 
      options, 
      colors, 
      price,
      categories,
      years,
      mpg,
      drivenWheels,
      numOfDoors
    } = vinDetails
    const driveWheels = drivenWheels == 'four wheel drive'
    ? '4WD'
    : utils.acronomize(drivenWheels)
    const makeModelYear = `The ${years[0].year ?? '(No Year)'}  ${make.name ?? '(No Make)'} ${model.name ?? '(No Model)'} (VIN: ${vin.toUpperCase()}) is a ${numOfDoors}-door, ${driveWheels} ${categories.primaryBodyType ?? '(No Body Type)'}. `
    const engineConfig = engine.type == 'gas' || engine.fuelType == 'regular unleaded' || /\(ffv\)/i.test(engine.type)
    ? `It has a gas powered ${engine.size}L ${utils.capitalizeEachWord(engine.configuration)}${engine.configuration=='V'?'':' '}${engine.cylinder} that boasts ${engine.horsepower} horsepower and ${engine.torque} NM of torque, which gets ${mpg.city} MPG in the city, and ${mpg.highway} on the highway.`
    : engine.type == 'electric'
    ? `It has a Electrically powered vehicle.`
    : engine.type == 'hybrid'
    ? `It's a Hybrid Gas/Electric vehicle, with a ${engine.size}L ${utils.capitalizeEachWord(engine.configuration)}${engine.configuration=='V'?'':' '}${engine.cylinder} that boasts ${engine.horsepower} horsepower and ${engine.tourqe} NM of tourqe, which gets ${mpg.city} MPG in the city, and ${mpg.highway} on the highway.`
    : `(Unknown Engine Config, Report this with "${context.prefix}suggest")`
    const transConfig = transmission.numberOfSpeeds == 'continuously variable'
    ? `It has continuously variable transmission.`
    : engine.type == 'electric'
    ? ``
    : Number(transmission.numberOfSpeeds) > 1
    ? `It has a ${transmission.numberOfSpeeds} speed ${transmission.transmissionType.toLowerCase()} transmission.`
    : ``
    const priceString = price && price.baseMsrp
    ? `The base MSRP is: $${price.baseMsrp}.`
    : ``
    return {
      success: true,
      reply: `${makeModelYear} ${engineConfig} ${transConfig} ${priceString}`
    }
  } catch (e) {
    return {
      success: false,
      reply: `There was an error getting that VIN's details. Error: ${e}`
    }
  }
}