import utils from '../utils'

module.exports = async (client, context) => {
  pm = +(await utils.getData('plopMoments')) + 1
  utils.setData("plopMoments", pm)
  return { success: true, reply: `There has been ${pm} plop moments donkJAM` }
}