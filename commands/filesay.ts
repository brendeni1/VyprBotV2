import utils from '../utils'

module.exports = async (client, context) => {
  try {
    if (!context.mod && !await utils.checkAdmin(context.user)) {
      return {
        success: false,
        reply: `You don't have permission to use that command! Required: Moderator or Admin ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
      }
    }
    if (!context.args[0]) {
      return {
        success: false,
        reply: `Please provide a link to a raw text file! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
      }
    }
    const pageType = await utils.checkContentType(context.args[0])
    if (!pageType || pageType != 'text/plain') {
      return {
        success: false,
        reply: `There was an issue getting the content on that file! Use a direct text file link. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
      }
    }
    let pageContent = await utils.fetch(context.args[0], undefined, 'text')
    if(!pageContent || pageContent.length == 0) {
      return {
        success: false,
        reply: `There was no text on that file! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
      }
    }
    pageContent = pageContent.replace(/\r/g, '').split('\n')
    let length = pageContent.length
    if (length > 500) {
      return {
        success: false,
        reply: `That file has too many lines of text! The max amount of lines is 500, and that file has ${length} lines.`
      }
    }
    return {
      success: true,
      reply: pageContent
    }
  } catch (e) {
    return {
      success: false,
      reply: `${e} ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
    }
  }
}

