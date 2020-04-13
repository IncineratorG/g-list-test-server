const emailConverter = require('../email-converter/emailConverter');

exports.getId = value => {
    return emailConverter.encodeEmail(value);
};
