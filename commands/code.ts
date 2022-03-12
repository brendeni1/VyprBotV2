import utils from '../utils'
import fs from 'fs-extra'

module.exports = async (client, context) => {
  if(!context.args[0]) { return { success: false, reply: `Please provide a valid command to view the code of!` } }
  let command = context.args[0].toLowerCase() + '.js'
  if(command == 'followage.js') { command = 'fa.js' }
  if(command == 'subage.js') { command = 'sa.js' }
  let commandCheck = (await fs.readdir(__dirname)).indexOf(command)
  if(commandCheck == -1 || command == 'handler.js' || command == 'template.js') { return { success: false, reply: `Please provide a valid command!` } }
  command = command.replace('.js', '.ts')
  return { success: true, reply: `Code for "${command.replace('.ts', '')}": https://github.com/DarkVypr/VyprBotV2/blob/main/commands/${command}` }
}