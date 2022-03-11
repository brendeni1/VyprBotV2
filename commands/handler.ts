import fs from 'fs-extra'
import importDir from 'directory-import'

module.exports = async (command, client, context) => {
  if(command == 'followage') { command = 'fa' }
  if(command == 'subage') { command = 'sa' }
  let commandCheck = (await fs.readdir(__dirname)).indexOf(command + '.js')
  command = command.toLowerCase() + '.js'
  if(commandCheck == -1 || command == 'handler') { return null }
  const importedModules = importDir()
  return await importedModules[`/${command}`](client, context)
}