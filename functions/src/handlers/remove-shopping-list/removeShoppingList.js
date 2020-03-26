const statusTypes = require('../../data/common/statusTypes');
const firebasePaths = require('../../helpers/firebase-paths/firebasePaths');

exports.removeShoppingListHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const {shoppingListId} = requestData;
    if (!shoppingListId) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    const listSenderPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_SENDER,
        shoppingListId,
    });
    const listReceiversPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_RECEIVERS,
        shoppingListId,
    });

    const senderData = await admin
        .database()
        .ref(listSenderPath)
        .once('value');
    const receiversData = await admin
        .database()
        .ref(listReceiversPath)
        .once('value');

    const senderPhone = senderData.val();
    const receiversPhones = [];
    receiversData.forEach(child => {
        receiversPhones.push(child.val());
    });

    let updates = {};

    const userSendPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.USER_SEND_DELIM,
        userId: senderPhone,
    });
    updates[userSendPath + shoppingListId] = null;

    receiversPhones.forEach(receiverPhone => {
        const userReceivedPath = firebasePaths.getPath({
            pathType: firebasePaths.paths.USER_RECEIVED_DELIM,
            userId: receiverPhone,
        });
        updates[userReceivedPath + shoppingListId] = null;
    });

    const shoppingListPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_DATA,
        shoppingListId,
    });
    updates[shoppingListPath] = null;

    await admin.database().ref().update(updates);

    res.json({
        status: statusTypes.SUCCESS,
    });
};
