import utils from '../utils'

module.exports = async (client, context) => {
	const currentYear = new Date().getFullYear()
	const christmas = new Date(`December 25, ${currentYear}`)
	if (new Date().toDateString() == christmas.toDateString()) {
		return {
			success: true,
			reply: `YAAAY peepoSnow It's finally that time of year! Merry Christmas! peepoSnow YAAAY`
		}
	}
	return {
		success: true,
		reply: `There is ${utils.formatDelta(christmas)} (GMT) left until christmas! peepoSnow 🎄`
	}
}