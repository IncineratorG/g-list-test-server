exports.encodeEmail = userEmail => {
    return userEmail.replace(atSign, atReplacer).replace(dotSignGlobal, dotReplacer);
};

exports.decodeEmail = encodedEmail => {
  return encodedEmail.replace(atReplacer, atSign).replace(dotReplacerGlobal, dotSign);
};

const atSign = '@';
const dotSign = '.';
const dotSignGlobal = /\./g;
const atReplacer = '@';
const dotReplacer = '%';
const dotReplacerGlobal = /%/g;
