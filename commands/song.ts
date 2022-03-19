import utils from '../utils'

module.exports = async (client, context) => {
	if (!context.args[0]) {
		return {
			success: false,
			reply: `Please provide a song name to look up.`
		}
	}
	const searchInput = context.args.join(' ').match(/index(:|=)(\d+)/i)
	var index = searchInput ? +searchInput[2] : 0;
	if (searchInput) {
		context.args.splice(context.args.indexOf(searchInput[0]), 1)
	}
	let songInfo = await utils.fetch(`http://api.musixmatch.com/ws/1.1/track.search?apikey=${process.env['MUSICXMATCH_KEY']}&q_track=${encodeURIComponent(context.args.join(' '))}&s_track_rating=DESC`)
	let tracks = songInfo.message.body.track_list
	if (tracks.length == 0) {
		return {
			success: false,
			reply: `No songs could be found using that phrase.`
		}
	}
	if (index > tracks.length - 1) {
		return {
			success: false,
			reply: `The song index you specified is larger than the amount of results. Please use an index less than or equal to ${tracks.length - 1}.`
		}
	}
	var flags = []
	if (tracks[index].track.explicit == 1) {
		flags.push('Explicit')
	}
	if (tracks[index].track.has_lyrics == 1) {
		flags.push('Has Lyrics')
	}
	if (tracks[index].track.has_subtitles == 1) {
		flags.push('Has Subtitles')
	}
	if (tracks[index].track.restricted == 1) {
		flags.push('Restricted')
	}
	return {
		success: true,
		reply: `Artist: ${tracks[index].track.artist_name} | Album: ${tracks[index].track.album_name} | Track: ${tracks[index].track.track_name} | Flags: ${flags[0] ? flags.join(', ') : '(None)'}`
	}
}