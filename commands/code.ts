import utils from '../utils'
import fs from 'fs-extra'

module.exports = async (client, context) => {
	if (!context.args[0]) {
		return {
			success: true,
			reply: `VyprBot's code can be found at: https://github.com/DarkVypr/VyprBotv2`
		}
	}
	let command = context.args[0].toLowerCase() + '.js'
  if(command == 'followage') { command = 'fa' }
  if(command == 'stream') { command = 'si' }
  if(command == 'birthday') { command = 'bday' }
  if(command == 'top') { command = 'topstreams' }
  if(command == 'subage') { command = 'sa' }
  if(command == 'steam') { command = 'game' }
	let commandCheck = (await fs.readdir(__dirname)).indexOf(command)
	if (commandCheck == -1 || command == 'handler.js' || command == 'template.js') {
		return {
			success: false,
			reply: `Please provide a valid command! ${await utils.bestEmote(context.channel, ['BRUHFAINT', 'BruhFaint', 'PANIC', 'FeelsDankMan', 'FeelsBadMan', '😵', '⛔'])}`
		}
	}
	command = command.replace('.js', '.ts')
	return {
		success: true,
		reply: `Code for "${command.replace('.ts', '')}": https://github.com/DarkVypr/VyprBotV2/blob/main/commands/${command}`
	}
}