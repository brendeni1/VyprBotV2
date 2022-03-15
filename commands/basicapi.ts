import utils from '../utils'

module.exports = async (client, context) => {
  if(!await utils.checkAdmin(context.user)) {
    return {
      success: false,
      reply: `You don't have permission to use that command. Required: Admin`
    }
  }
  if(!context.args[0]) {
    return {
      success: false,
      reply: `Provide a link to an API.`
    }
  }
  try {
    let response = await utils.fetch(context.args[0])
    return {
      success: true,
      reply: JSON.stringify(response)
    }
  }catch(e) {
    return {
      success: false,
      reply: e
    }
  }
}