import fs from 'fs-extra'
import importDir from 'directory-import'
import cooldown from '../cooldown'

module.exports = async (command, client, context) => {
  if(command == 'followage') { command = 'fa' }
  if(command == 'subage') { command = 'sa' }
  let commandCheck = (await fs.readdir(__dirname)).indexOf(command + '.js')
  command = command.toLowerCase() + '.js'
  if(commandCheck == -1 || command == 'handler') { return null }
  const importedModules = importDir()
  context.user == 'darkvypr' ? null : cooldown.commandAdd(context.user); setTimeout(() => { cooldown.commandDelete(context.user) }, 1500)
  return await importedModules[`/${command}`](client, context)
}