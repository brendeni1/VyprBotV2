import utils from '../utils'

module.exports = (context) => {
  const regexArray = [
    `\\b(v|b)ypa(')?(s)?\\b`,
    `(bright|dark)?(v|b)(y)p(e|u|o)?r`,
    `\\b(dv(')?(s)?)\\b`,
    `vpyr`,
    `\\b(b|v)o?ip(o*|u)r\\b`,
    `\\b(bright|dark)vip(e|u|o)r\\b`,
    `\\b(b|v)ip(o|u)r\\b`,
    `\\b(b|v)pe?r\\b`,
    `\\b(dark|bright)?\\s?dype?(r|a)\\b`,
    `darkv`,
    `\\b(b|v)ooper\\b`,
    `(dark|bright)\\s?diaper`,
    `(dark|bright)\\s?viper|vypr`,
  ]

  let ping = false

  for (i = 0; i < regexArray.length; i++) {
    let regex = new RegExp(regexArray[i], 'gi')
    if (regex.test(context.message)) {
      ping = true
      break
    }
  }

  const blacklistedChannels = ['visioisiv', 'darkvypr', 'vyprbottesting', 'vyprbot']
  const blacklistedUsers = ['darkvypr', 'vyprbot', 'vyprbottesting', 'hhharrisonnnbot', 'apulxd', 'daumenbot', 'kuharabot', 'snappingbot', 'oura_bot', 'streamelements', 'supibot']

  if (ping && blacklistedChannels.indexOf(context.channel) == -1 && blacklistedUsers.indexOf(context.user) == -1) {
    return `#${context.channel} | @${context.user} | ${context.message}`
  }
  else {
    return null
  }
}