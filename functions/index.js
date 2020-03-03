const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const signIn = require('./src/handlers/sign-in/signIn');
const signUp = require('./src/handlers/sign-up/signUp');
const checkUser = require('./src/handlers/check-user/checkUser');
const sendMessage = require('./src/handlers/send-message/sendMessage');

exports.signIn = functions.https.onRequest(async (req, res) => {
    await signIn.signInHandler({req, res, admin});
});

exports.signUp = functions.https.onRequest(async (req, res) => {
    await signUp.signUpHandler({req, res, admin});
});

exports.checkUser = functions.https.onRequest(async (req, res) => {
    await checkUser.checkUserHandler({req, res, admin});
});

exports.sendMessage = functions.https.onRequest(async (req, res) => {
    await sendMessage.sendMessageHandler({req, res, admin});
});
