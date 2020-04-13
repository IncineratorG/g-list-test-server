exports.encodeEmail = userEmail => {
    return userEmail.replace(atSign, atReplacer).replace(dotSign, dotReplacer);
};

exports.decodeEmail = encodedEmail => {
  return encodedEmail.replace(atReplacer, atSign).replace(dotReplacer, dotSign);
};

const atSign = '@';
const dotSign = '.';
const atReplacer = ',';
const dotReplacer = ',,';
