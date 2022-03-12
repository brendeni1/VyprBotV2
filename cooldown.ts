const [ huntCooldown, cdrCooldown, commandCooldown ] = [new Set(), new Set(), new Set()]

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

const commandAdd = (user) => {
  commandCooldown.add(user)
}
exports.commandAdd = commandAdd

const commandDelete = (user) => {
  commandCooldown.delete(user)
}
exports.commandDelete = commandDelete

const commandCheck = (user) => {
  return commandCooldown.has(user)
}
exports.commandCheck = commandCheck