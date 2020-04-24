exports.encodeEmail = userEmail => {
    return userEmail
        .replace(atSign, atReplacer)
        .replace(dotSignGlobal, dotReplacer)
        .replace(shiftSignGlobal, shiftReplacer)
        .replace(dollarSignGlobal, dollarReplacer)
        .replace(openBracketSignGlobal, openBracketReplacer)
        .replace(closeBracketSignGlobal, closeBracketReplacer);
};

exports.decodeEmail = encodedEmail => {
  return encodedEmail
      .replace(atReplacer, atSign)
      .replace(dotReplacerGlobal, dotSign)
      .replace(shiftReplacerGlobal, shiftSign)
      .replace(dollarReplacerGlobal, dollarSign)
      .replace(openBracketReplacerGlobal, openBracketSign)
      .replace(closeBracketReplacerGlobal, closeBracketSign);
};

const atSign = '@';
const atReplacer = '@';

const dotSign = '.';
const dotSignGlobal = /\./g;
const dotReplacer = '%';
const dotReplacerGlobal = /%/g;

const shiftSign = '#';
const shiftSignGlobal = /#/g;
const shiftReplacer = '*';
const shiftReplacerGlobal = /\*/g;

const dollarSign = '$';
const dollarSignGlobal = /\^/g;
const dollarReplacer = '^';
const dollarReplacerGlobal = /\^/g;

const openBracketSign = '[';
const openBracketSignGlobal = /\[/g;
const openBracketReplacer = '+';
const openBracketReplacerGlobal = /\+/g;

const closeBracketSign = ']';
const closeBracketSignGlobal = /]/g;
const closeBracketReplacer = '-';
const closeBracketReplacerGlobal = /-/g;
