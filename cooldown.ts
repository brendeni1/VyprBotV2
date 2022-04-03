const [huntCooldown, cdrCooldown, commandCooldown] = [new Set(), new Set(), new Set()]

// Hunt Command Cooldown

const huntAdd = (user) => {
  huntCooldown.add(user)
}
exports.huntAdd = huntAdd

const huntDelete = (user) => {
  huntCooldown.delete(user)
}
exports.huntDelete = huntDelete

const huntCheck = (user) => {
  return huntCooldown.has(user)
}
exports.huntCheck = huntCheck

// CDR Command Cooldown

const cdrAdd = (user) => {
  cdrCooldown.add(user)
}
exports.cdrAdd = cdrAdd

const cdrDelete = (user) => {
  cdrCooldown.delete(user)
}
exports.cdrDelete = cdrDelete

const cdrCheck = (user) => {
  return cdrCooldown.has(user)
}
exports.cdrCheck = cdrCheck

// Command Command

const addToCooldown = (user, time) => {
  if (!user || !time) {
    throw `No ${!user && !time ? 'user or time' : !user ? 'user' : !time ? 'length' : '(unknown)'} was provided for cooldown.`
  }
  if (isNaN(time)) {
    throw `The time provided was not a valid number!`
  }
  commandCooldown.add(user)
  setTimeout(() => {
    commandCooldown.delete(user)
  }, time)
}
exports.addToCooldown = addToCooldown

const commandCheck = (user) => {
  if (!user) {
    throw `No user was provided for cooldown!`
  }
  return commandCooldown.has(user)
}
exports.commandCheck = commandCheck