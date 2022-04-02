import utils from '../utils'
import wiki from 'wikipedia'

module.exports = async (client, context) => {
	const phraseCheck = context.args.join(' ').match(/index(:|=)(\d+)/i)
	var index = phraseCheck ? +phraseCheck[2] : 0
	if (phraseCheck) {
		context.args.splice(context.args.indexOf(phraseCheck[0]), 1)
	}
  if (!context.args[0]) {
    return {
      success: false,
      reply: `Please provide a word or phrase to look up! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
    }
  }
  try {
    let dictionaryResult = await utils.fetch(`https://wordsapiv1.p.rapidapi.com/words/${context.args.join(' ')}/definitions`, {
      'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
      'X-RapidAPI-Key': process.env.RAPID_API_KEY
    })
    if (dictionaryResult.definitions[0]) {
      if(index > dictionaryResult.definitions.length - 1) {
        return {
          success: false,
          reply: `The definition index you specified is larger than the amount of results. Please use an index less than or equal to ${dictionaryResult.definitions.length - 1}. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
        }
      }
      let word = dictionaryResult.word
      let definition = dictionaryResult.definitions[index].definition ?? `(No Definition)`
      let partOfSpeech = dictionaryResult.definitions[index].partOfSpeech ?? `(No Part of Speech)`
      return {
        success: true,
        reply: `Source: English Dictionary --> (${dictionaryResult.definitions.length - 1} other definition${dictionaryResult.definitions.length==2?'':'s'}) ${word} | ${partOfSpeech} | ${definition}`
      }
    }
  } catch (e) {
    let wikiResult = await wiki.summary(encodeURIComponent(context.args.join(' ')))
    if(wikiResult.extract) {
      return {
        success: true,
        reply: `Source: Wikipedia --> ${wikiResult.content_urls.desktop.page} | ${wikiResult.extract.replace(/(\r\n|\n|\r)/gm, " ")}`
      }
    }
  	let urbanResult = await utils.fetch(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(context.args.join(' '))}`, {
  		timeout: 10000
  	})
    urbanResult = urbanResult.list
  	if (urbanResult.length == 0) {
  		return {
  			success: false,
  			reply: `There was no definition found for that word. Used resources: Urban Dictionary, Wikipedia and https://api-ninjas.com/api/dictionary ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
  		}
  	}
  	if (index > urbanResult.length - 1) {
  		return {
  			success: false,
  			reply: `The definition index you specified is larger than the amount of results. Please use an index less than or equal to ${urbanResult.length - 1}. ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
  		}
  	}
  	let [cleanDef, cleanExample] = [urbanResult[index].definition.replace(/\[|\]/gim, '').replace(/n:/, '').replace(/\"\r\n\r\n/gim, ' ').replace(/\b\\b/gim, '').replace(/(\r\n|\n|\r)/gim, " "), urbanResult[index].example.replace(/\[|\]/gim, '').replace(/\"\r\n\r\n/gim, ' ').replace(/\b\\b/gim, '').replace(/(\r\n|\n|\r)/gim, " ")]
  	return {
  		success: true,
  		reply: `Source: Urban Dictionary --> (${urbanResult.length - 1} other definition${urbanResult.length==2?'':'s'}) (${urbanResult[index].thumbs_up} upvote${+urbanResult[index].thumbs_up==1?'':'s'}) - ${cleanDef} <--> Example: ${cleanExample}`
  	}
  }
}