import utils from '../utils'

module.exports = async (client, context) => {
	if (!await utils.checkAdmin(context.user)) {
		return {
			success: false,
			reply: `You don't have permission to use that command! Required: Admin`
		}
	}
	if (!context.args[0] || !context.args[1]) {
		return {
			success: false,
			reply: `Invalid syntax! Usage: "${context.prefix}rename old:{user's old name} new:{user's new name}"`
		}
	}
	const [oldCheck, newCheck] = [context.args.join(' ').match(/old(:|=)(\w+)/i), context.args.join(' ').match(/new(:|=)(\w+)/i)]
	var oldName = oldCheck ? oldCheck[2].toLowerCase() : null;
	if (oldCheck) {
		context.args.splice(context.args.indexOf(oldCheck[0]), 1)
	}
	var newName = newCheck ? newCheck[2].toLowerCase() : null;
	if (newCheck) {
		context.args.splice(context.args.indexOf(newCheck[0]), 1)
	}
	let [oldData, oldBday, oldLocation, oldTwitter, oldNammers, oldPrefix] = [await utils.listData(oldName), await utils.getData(`${oldName}Birthday`), await utils.getData(`${oldName}Location`), await utils.getData(`${oldName}Twitter`), await utils.getData(`${oldName}Nammers`), await utils.getData(`${oldName}Prefix`)]
	if (!oldData[0]) {
		return {
			success: false,
			reply: `There is no data associated with that account!`
		}
	}
	if (oldBday) {
		utils.setData(`${newName}Birthday`, oldBday)
	}
	if (oldLocation) {
		utils.setData(`${newName}Location`, oldLocation)
	}
	if (oldTwitter) {
		utils.setData(`${newName}Twitter`, oldTwitter)
	}
	if (oldNammers) {
		utils.setData(`${newName}Nammers`, oldNammers)
	}
	if (oldPrefix) {
		utils.setData(`${newName}Prefix`, oldPrefix)
	}
	for (let i = 0; i < oldData.length; i++) {
		utils.deleteData(oldData[i])
	}
	return {
		success: true,
		reply: `Succesfully transferred all of the data from "${oldName}" to "${newName}" EZ`
	}
}