import utils from '../utils'

module.exports = async (client, context) => {
  const responses = [
    "😃 It is certain.",
    "😃 It is decidedly so.",
    "😃 Without a doubt.",
    "😃 Yes - definitely.",
    "😃 You may rely on it.",
    "😃 As I see it, yes.",
    "😃 Most likely.",
    "😃 Outlook good.",
    "😃 Yes.",
    "😃 Signs point to yes.",
    "😐 Reply hazy, try again.",
    "😐 Ask again later.",
    "😐 Better not tell you now.",
    "😐 Cannot predict now.",
    "😐 Concentrate and ask again.",
    "😦 Don't count on it.",
    "😦 My reply is no.",
    "😦 My sources say no.",
    "😦 Outlook not so good.",
    "😦 Very doubtful."
  ]
  return { success: true, reply: utils.randArrayElement(responses) }
}