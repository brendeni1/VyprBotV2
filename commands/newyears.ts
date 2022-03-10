import utils from '../utils'

module.exports = async (client, context) => {
  const currentYear = new Date().getFullYear()
  const newYears = new Date(`January 1, ${+currentYear + 1}`)
  if (new Date().toDateString() == newYears.toDateString()) { return { success: true, reply: `YAAAY 🎉 🎊 🪅 Happy New Years!!! 🎉 🎊 🪅 YAAAY` } }
  return { success: true, reply: `There is ${utils.formatDelta(newYears)} (GMT) left until new years! PauseChamp 🎉` }
}