import utils from '../utils'

module.exports = async (client, context) => {
	const languages = {
		arabic: "ara",
		bulgarian: "bul",
		chinese: "chs",
		croatian: "hrv",
		czech: "cze",
		danish: "dan",
		dutch: "dut",
		english: "eng",
		finnish: "fin",
		french: "fre",
		german: "ger",
		greek: "gre",
		hungarian: "hun",
		korean: "kor",
		italian: "ita",
		japanese: "jpn",
		polish: "pol",
		portuguese: "por",
		russian: "rus",
		slovenian: "slv",
		spanish: "spa",
		swedish: "swe",
		turkish: "tur"
	}
	const langCheck = context.args.join(' ').match(/lang(uage)?(:|=)(\w+)/i)
	let language = langCheck ? langCheck[3].toLowerCase() : 'eng';
	if (langCheck) {
		context.args.splice(context.args.indexOf(langCheck[0]), 1)
	}
	if (!context.args[0]) {
		return {
			success: false,
			reply: `Provide an image link, and optionally a source language. Example: "${context.prefix}ocr {image} lang:{language}". Languages: https://i.darkvypr.com/ocr_languages.png`
		}
	}
	if (!languages[language] && language != 'eng') {
		return {
			success: false,
			reply: `That wasn't a valid language! List: https://i.darkvypr.com/ocr_languages.png`
		}
	}
	language != 'eng' ? language = languages[language] : null
	const ocrData = await utils.fetch(`https://api.ocr.space/parse/imageurl?apikey=${process.env['OCR_KEY']}&url=${context.args[0]}&language=${language}&scale=true&isTable=true`)
	if (!ocrData.ParsedResults[0]) {
		return {
			success: false,
			reply: `OCR.space couldn't read the text in that image.`
		}
	}
	return {
		success: true,
		reply: ocrData.ParsedResults[0].ParsedText.replace(/\t|\r|\n/g, '')
	}
}