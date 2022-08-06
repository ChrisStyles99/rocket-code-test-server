function validateFullName(fullName) {
  let firstName = '';
  let middleName = '';
  let fatherLastName = '';
  let motherLastName = '';
  if(fullName.length === 2) {
    firstName = fullName[0];
    fatherLastName = fullName[1];
  }

  return {
    firstName, middleName, fatherLastName, motherLastName
  }
}

function validateBirthday(birthday) {
  console.log(new Date(birthday).toISOString());

  return new Date(birthday).toISOString();
}

module.exports = {
  validateFullName, validateBirthday
}