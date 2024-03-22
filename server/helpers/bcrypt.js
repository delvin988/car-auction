const bcrypt = require("bcryptjs");

function encodePassword(instance) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(instance.password, salt);
  return hash;
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

module.exports = {
  encodePassword,
  comparePassword,
};