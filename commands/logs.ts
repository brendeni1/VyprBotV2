import utils from '../utils'

module.exports = async (client, context) => {
  try {
    let target = context.args[0]
      ? context.args[0].toLowerCase().replace('@', '')
      : context.user
    let channel = context.args[1]
      ? context.args[1].toLowerCase().replace('@', '')
      : context.channel
    
    let leppuChannels = await utils.fetch('https://logs.ivr.fi/channels')
    leppuChannels = leppuChannels.channels.map(i => {
      return i.name
    })
    if (leppuChannels.indexOf(channel) > -1) {
      return {
        success: true,
        reply: `@${target} in #${channel} | https://logs.ivr.fi/?channel=${channel}&username=${target}`
      }
    }
    
    let apulxdChannels = await utils.fetch('https://logs.apulxd.ga/channels')
    apulxdChannels = apulxdChannels.channels.map(i => {
      return i.name
    })
    if (apulxdChannels.indexOf(channel) > -1) {
      return {
        success: true,
        reply: `@${target} in #${channel} | https://logs.apulxd.ga/?channel=${channel}&username=${target}`
      }
    }

    let harambelogsChannels = await utils.fetch('https://harambelogs.pl/channels')
    harambelogsChannels = harambelogsChannels.channels.map(i => {
      return i.name
    })
    if (harambelogsChannels.indexOf(channel) > -1) {
      return {
        success: true,
        reply: `@${target} in #${channel} | https://harambelogs.pl/?channel=${channel}&username=${target}`
      }
    }

    let magichackChannels = await utils.fetch('https://logs.magichack.xyz/channels')
    magichackChannels = magichackChannels.channels.map(i => {
      return i.name
    })
    if (magichackChannels.indexOf(channel) > -1) {
      return {
        success: true,
        reply: `@${target} in #${channel} | https://logs.magichack.xyz/?channel=${channel}&username=${target}`
      }
    }
    
    let vtlogsChannels = await utils.fetch('https://vtlogs.moe/channels')
    vtlogsChannels = vtlogsChannels.channels.map(i => {
      return i.name
    })
    if (vtlogsChannels.indexOf(channel) > -1) {
      return {
        success: true,
        reply: `@${target} in #${channel} | https://vtlogs.moe/?channel=${channel}&username=${target}`
      }
    }

    return {
      success: false,
      reply: `That channel (#${channel}) isn't on any log sites, or the user (@${target}) hasn't said anything in that channel.`
    }
  } catch (e) {
    return {
      success: false,
      reply: `That channel (#${channel}) isn't on any log sites, or the user (@${target}) hasn't said anything in that channel.`
    }
  }
}