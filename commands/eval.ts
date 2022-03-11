import utils from '../utils'

module.exports = async (client, context) => {
  if(!utils.checkAdmin(context.user)) { return { success: false, reply: `You don't have permission to use that command! Required: Admin` } }
  if(!context.args[0]) { return { success: false, reply: `Provide an expression to evaluate!` } }
  const input = context.args.join(' ')
  if(/process.env/i.test(input) && context.user != 'darkvypr') { return { success: false, reply: `Only DarkVypr can use process.env.` } }
  try {
    return await eval(input)
  }catch(e) {
    return { sucess: false, reply: e }
  }
}