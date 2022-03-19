import utils from '../utils'

module.exports = async (client, context) => {
  const randInt = utils.randInt(1, 41)
  return {
    success: true,
    reply: questions[randInt]
  }
}

const questions = {
   "1":"Would you rather eat a bug or a fly?",
   "3":"Would you rather lick the floor or a broom?",
   "4":"Would you rather eat ice cream or cake?",
   "5":"Would you rather lick your keyboard or mouse?",
   "6":"Would you rather wash your hair with mash potatoes or cranberry sauce?",
   "7":"Would you rather team up with Wonder Woman or Captain Marvel?",
   "8":"Would you rather want to find true love or win lottery next month?",
   "9":"Would you rather be forced to sing along or dance to every song you hear?",
   "10":" Would you rather have everyone you know be able to read your thoughts or for everyone you know to have access to your Internet history?",
   "11":"Would you rather be chronically under-dressed or overdressed?",
   "12":"Would you rather clean a toliet or a babys diaper",
   "13":"Would you rather lose your sight or your memories?",
   "14":"Would you rather have universal respect or unlimited power?",
   "15":"Would you rather give up air conditioning and heating for the rest of your life or give up the Internet for the rest of your life?",
   "16":"Would you rather swim in a pool full of Nutella or a pool full of maple syrup?",
   "17":"Would you rather labor under a hot sun or extreme cold?",
   "18":"Would you rather stay in during a snow day or build a fort?",
   "19":"Would you rather buy 10 things you don\u2019t need every time you go shopping or always forget the one thing that you need when you go to the store?",
   "20":"Would you rather never be able to go out during the day or never be able to go out at night?",
   "21":"Would you rather have a personal maid or a personal chef?",
   "22":"Would you rather have Beyonc\u00e9\u2019s talent or Jay-Z\u2018s business acumen?",
   "23":"Would you rather be an extra in an Oscar-winning movie or the lead in a box office bomb?",
   "24":"Would you rather vomit on your hero or have your hero vomit on you?",
   "25":"Would you rather communicate only in emoji or never be able to text at all ever again?",
   "26":"Would you rather be royalty 1",
   "27":"000 years ago or an average person today?",
   "28":"Would you rather lounge by the pool or on the beach?",
   "29":"Would you rather wear the same socks for a month or the same underwear for a week?",
   "30":"Would you rather work an overtime shift with your annoying boss or spend full day with your mother-in-law?",
   "31":"Would you rather cuddle a koala or pal around with a panda?",
   "32":"Would you rather have a sing-off with Ariana Grande or a dance-off with Rihanna?",
   "33":"Would you rather watch nothing but Hallmark Christmas movies or nothing but horror movies?",
   "34":"Would you rather always be 10 minutes late or always be 20 minutes early?",
   "35":"Would you rather have a pause or a rewind button in your life?",
   "36":"Would you rather lose all your teeth or lose a day of your life every time you kissed someone?",
   "37":"Would you rather drink from a toilet or pee in a litter box?",
   "38":"Would you rather be forced to live the same day over and over again for a full year or take 3 years off the end of your life?",
   "39":"or take 3 years off the end of your life?",
   "40":"Would you rather never eat watermelon ever again or be forced to eat watermelon with every meal?",
   "41":"Would you rather go to Harvard but graduate and be jobless, or gradute from another college and work for Harvard"
}