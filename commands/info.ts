import utils from '../utils'

module.exports = async (client, context) => {
  const idCheck = context.args.join(' ').match(/(u?id|lookup)(:|=)(true|false)/i)
  const id = idCheck ? Boolean(idCheck[2].toLowerCase()) : false; if (idCheck) { context.args.splice(context.args.indexOf(idCheck[0]), 1) }
  user = context.args[0] ? context.args[0].toLowerCase().replace('@', '') : context.user
  try {
    userData = await utils.fetch(`https://api.ivr.fi/v2/twitch/user/${user}?id=${id}`)
    let creationDate = utils.formatDate(userData.createdAt, "fullDate")
    let timeSinceCreation = utils.formatDelta(creationDate)
    var roles = []
    var uid = userData.id
    if (userData.roles.isAffiliate) { roles.push('Affiliate') }
    if (userData.roles.isPartner) { roles.push('Partner') }
    if (userData.roles.isStaff) { roles.push('Staff') }
    if (userData.verifiedBot) { roles.push('Verified-Bot') }
    if (!userData.roles.isAffiliate && !userData.roles.isPartner && !userData.roles.isStaff && !userData.verifiedBot) { roles.push('No Roles') }
    const bannedUser = userData.banned ? `true, ${userData.banReason}` : 'false'
    let obj = {
      banned: userData.banned,
      followers: userData.followers,
      following: userData.follows,
      name: userData.displayName,
      uid: uid,
      bio: userData.bio,
      colour: userData.chatColor,
      pfp: userData.logo,
      rolesArray: roles,
      roles: roles.join(', '),
      creationDate: creationDate,
      timeSinceCreation: timeSinceCreation,
    }
    return { success: true, obj, reply: `Display Name: @${obj.name} | Banned: ${bannedUser} | UID: ${obj.uid} | Created: ${obj.creationDate} (${obj.timeSinceCreation} ago) | Followers: ${obj.followers} | Colour: ${obj.colour ?? '(No Colour Set)'} | Bio: ${obj.bio ?? '(No Bio Set)'} | Profile Picture: ${obj.pfp} | Roles: ${obj.roles}` }
  } catch (err) {
    return { success: false, reply: err }
  }
}