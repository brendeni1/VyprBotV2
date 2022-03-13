import fs from 'fs-extra'
import importDir from 'directory-import'
import cooldown from '../cooldown'
import utils from '../utils'

module.exports = async (command, client, context) => {
  if(command == 'followage') { command = 'fa' }
  if(command == 'birthday') { command = 'bday' }
  if(command == 'subage') { command = 'sa' }
  command = command.toLowerCase() + '.js'
  let commandCheck = (await fs.readdir(__dirname)).indexOf(command)
  if(commandCheck == -1 || command == 'handler.js') { return null }
  const importedModules = importDir()
  context.user == 'darkvypr' ? null : cooldown.commandAdd(context.user); setTimeout(() => { cooldown.commandDelete(context.user) }, 1500)
  let usage = await utils.getData('commandUsage'); utils.setData("commandUsage", +usage + 1);
  return await importedModules[`/${command}`](client, context)
}