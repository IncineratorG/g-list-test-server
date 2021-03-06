const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const signIn = require('./src/handlers/sign-in/signIn');
const signUp = require('./src/handlers/sign-up/signUp');
const checkUser = require('./src/handlers/check-user/checkUser');
const sendMessage = require('./src/handlers/send-message/sendMessage');
const shareShoppingList = require('./src/handlers/share-shopping-list/shareShoppingList');
const removeShoppingList = require('./src/handlers/remove-shopping-list/removeShoppingList');
const sendUpdateMessage = require('./src/handlers/send-update-message/sendUpdateMessage');
const updateTimestamp = require('./src/handlers/update-timestamp/updateTimestamp');
const setProductStatus = require('./src/handlers/set-product-status/setProductStatus');
const addProduct = require('./src/handlers/add-product/addProduct');
const removeProduct = require('./src/handlers/remove-product/removeProduct');
const addCollaborator = require('./src/handlers/add-collaborator/addCollaborator');
const removeCollaborator = require('./src/handlers/remove-collaborator/removeCollaborator');
const notifyUsers = require('./src/handlers/notify-users/notifyUsers');

exports.sendMessage = functions.https.onRequest(async (req, res) => {
    await sendMessage.sendMessageHandler({req, res, admin});
});

exports.sendUpdateMessage = functions.https.onRequest(async (req, res) => {
    await sendUpdateMessage.sendUpdateMessageHandler({req, res, admin});
});

exports.updateTimestamp = functions.https.onRequest(async (req, res) => {
    await updateTimestamp.updateTimestampHandler({req, res, admin});
});

exports.signIn = functions.https.onRequest(async (req, res) => {
    await signIn.signInHandler({req, res, admin});
});

exports.signUp = functions.https.onRequest(async (req, res) => {
    await signUp.signUpHandler({req, res, admin});
});

exports.checkUser = functions.https.onRequest(async (req, res) => {
    await checkUser.checkUserHandler({req, res, admin});
});

exports.shareShoppingList = functions.https.onRequest(async (req, res) => {
    await shareShoppingList.shareShoppingListHandler({req, res, admin});
});

exports.removeShoppingList = functions.https.onRequest(async (req, res) => {
   await removeShoppingList.removeShoppingListHandler({req, res, admin});
});

exports.setProductStatus = functions.https.onRequest(async (req, res) => {
    await setProductStatus.setProductStatusHandler({req, res, admin});
});

exports.addProduct = functions.https.onRequest(async (req, res) => {
    await addProduct.addProductHandler({req, res, admin});
});

exports.removeProduct = functions.https.onRequest(async (req, res) => {
    await removeProduct.removeProductHandler({req, res, admin});
});

exports.addCollaborator = functions.https.onRequest(async (req, res) => {
    await addCollaborator.addCollaboratorHandler({req, res, admin});
});

exports.removeCollaborator = functions.https.onRequest(async (req, res) => {
    await removeCollaborator.removeCollaboratorHandler({req, res, admin});
});

exports.notifyUsers = functions.https.onRequest(async (req, res) => {
    await notifyUsers.notifyUsersHandler({req, res, admin});
});
