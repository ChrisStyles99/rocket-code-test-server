function validateBirthday(birthday) {
  return new Date(birthday).toISOString();
}

module.exports = {
  validateBirthday
}