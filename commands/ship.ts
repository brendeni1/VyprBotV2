import utils from '../utils'

module.exports = async (client, context) => {
  try {
    const sender = context.args[0]
      ? context.args[0].replace('@', '')
      : context.user
    const target = context.args[1]
      ? context.args[1].replace('@', '')
      : await utils.fetch(`https://decapi.me/twitch/random_user/${context.channel}`, undefined, 'text')
    const lovePercent = utils.randInt(0, 100)
    let hearts = ['💔', '💔', '💔', '💔', '💔', '💔', '💔', '💔', '💔', '💔']
    hearts = hearts.fill('💝', 0, Math.floor(lovePercent/10))
    const message = lovePercent <= 100 && lovePercent >= 80
    ? { array: ['HUGGIES', 'CatAHomie', 'AWWWW', '🥰'], msg: `@${sender} is fully in love with @${target}` }
    : lovePercent < 80 && lovePercent >= 60
    ? { array: ['MenheraShy', 'peepoShy', 'catKISS', '😳'], msg: `@${sender} has a crush on @${target} ` }
    : lovePercent < 60 && lovePercent >= 40
    ? { array: ['NekoProud', 'YESIDOTHINKSO', 'CatAHomie', '🫂'], msg: `@${sender} and @${target} are pretty close` }
    : lovePercent < 40 && lovePercent >= 20
    ? { array: ['YESIDOTHINKSO', 'NekoProud', 'EZ', '🙂'], msg: `@${sender} and @${target} are just friends` }
    : lovePercent < 20 && lovePercent >= 0
    ? { array: ['PoroSad', 'OhISee', 'SadGuitar', '🥲'], msg: `@${sender} and @${target} talk pretty rarely` }
    : { array: ['😱', 'FeelsBadMan', 'SadCat', '🫢'], msg: `Report this error with: "${context.prefix}suggest %:${lovePercent} error with love percent!"` }
    const emote = await utils.bestEmote(context.channel, message.array)
    return {
      success: true,
      reply: `(${lovePercent}%) ${message.msg} ${emote} | ${hearts.join(' ')}`
    }
  } catch (e) {
    return {
      success: false,
      reply: `There was an error! Report this with: "${context.prefix}suggest Error with ship.ts: ${e}"!`
    }
  }
}