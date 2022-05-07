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
    let vinDetails = await utils.fetch(
      `https://api.carmd.com/v3.0/decode?vin=${vin}`,
      {
        "authorization":process.env.VIN_KEY,
        "partner-token":process.env.PARTNER_VIN_TOKEN
      }
    )
    let { message, data } = vinDetails
    if (message.message != 'ok' || !data) {
      return {
        success: false,
        reply: `The VIN provided wasn't valid! Please use a different VIN number. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'NOPERS', 'FeelsDankMan', '😐', '😵‍💫'])}`
      }
    }
    let { year, make, model, manufacturer, engine, trim, transmission } = data
    return {
      success: true,
      reply: `VIN: ${vin} | Manufacturer: ${utils.capitalizeEachWord(manufacturer.toLowerCase())} | Year: ${year} | Make & Model: ${utils.capitalizeEachWord(make.toLowerCase())} ${utils.capitalizeEachWord(model.toLowerCase())} | Trim: ${trim ? utils.capitalizeEachWord(trim.toLowerCase()) : '(N/A)'} | Engine: ${engine ?? '(N/A)'} | Transmission: ${utils.capitalizeEachWord(transmission.toLowerCase())}`
    }
  } catch (e) {
    return {
      success: false,
      reply: e
    }
  }
}