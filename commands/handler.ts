import fs from 'fs-extra'
import importDir from 'directory-import'
import cooldown from '../cooldown'
import utils from '../utils'

module.exports = async (command, client, context) => {
	if (command == 'followage') {
		command = 'fa'
	}
	if (command == 'stream') {
		command = 'si'
	}
	if (command == 'rem') {
		command = 'listemotes'
	}
	if (command == 'birthday') {
		command = 'bday'
	}
	if (command == 'top') {
		command = 'topstreams'
	}
	if (command == 'subage') {
		command = 'sa'
	}
	if (command == 'steam') {
		command = 'game'
	}
	command = command.toLowerCase() + '.js'
	let commandCheck = (await fs.readdir(__dirname)).indexOf(command)
	if (commandCheck == -1 || command == 'handler.js') {
		return
	}
	const importedModules = importDir()
  if(context.user != 'darkvypr') {
    cooldown.addToCooldown(context.user, 3000)
  }
	let usage = await utils.getData('commandUsage');
	utils.setData("commandUsage", +usage + 1);
	return await importedModules[`/${command}`](client, context)
}