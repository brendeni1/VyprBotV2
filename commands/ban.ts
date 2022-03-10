import utils from '../utils'

module.exports = async (client, context) => {
    if(msg.isMod || channel == user || await isAdmin(user)) {
      if((await client.getMods(channel)).indexOf('vyprbot') == -1) { return { success: false, reply: `I am not a mod in this channel! Please mod me, and try again.` } }
      if(!args[0]) { return { success: false, reply: `Please provide one or more users to ban. They must be space-separated.` } }
      for (let i = 0; i < args.length; i++) {
        client.ban(channel, args[i].replace('@', ''), 'Automated by VyprBot.')
      }
      return { success: true, reply: `Successfully banned ${args.length} user(s)!` }
    }
    return { success: false, reply: `You must be a moderator or the owner of this channel to use this command!` }
}