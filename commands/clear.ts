// import utils from '../utils'

// module.exports = async (client, context) => {
//   if(!utils.checkPermitted(context.user) && !utils.checkAdmin(context.user)) { return { success: false, reply: `You don't have permission to use that command!` }  }
//     if (isPermitted) {
//       if (!isNumber(args[0]) || args[0] > 100 || args[0] < 1) {
//         client.me(channel, `${user} --> Invalid Syntax! The max clear is 100, and the format should be: "${prefix}clear {amount}"!`);
//       }
//       else {
//         for (let i = args[0]; i--;)
//           client.privmsg(channel, `/clear`);
//       }
//     }
//     else {
//       client.me(channel, `${user} --> You aren't permitted to use that command. Get the broadcaster to permit you and try again!`)
//     }
//   })
// }