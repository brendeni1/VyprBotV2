import utils from '../utils'

module.exports = async (client, context) => {
  return {
    success: true,
    reply: `#94DCCC ${await utils.bestEmote(context.channel, ['FeelsDonkMan', 'donkL', 'Donki', 'donkDisco', 'DonkCrayon', 'DinkDonk', 'DonkJAM', '😵‍💫'])}`
  }
}