const statusTypes = require('../../data/common/statusTypes');
const firebasePaths = require('../../helpers/firebase-paths/firebasePaths');
const idManager = require('../../helpers/id-manager/idManager');

exports.removeShoppingListHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const {shoppingListId} = requestData;
    if (!shoppingListId) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    // Путь до создателя списка.
    const listSenderPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_SENDER,
        shoppingListId,
    });
    // Путь до получателей списка.
    const listReceiversPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_RECEIVERS,
        shoppingListId,
    });

    // Получаем данные создателя списка.
    const senderData = await admin
        .database()
        .ref(listSenderPath)
        .once('value');
    // Получаем данные получателей списка.
    const receiversData = await admin
        .database()
        .ref(listReceiversPath)
        .once('value');

    // Получаем ID создателя и получателей списка.
    const senderId = idManager.getId(senderData.val());
    const receiversIds = [];
    receiversData.forEach(child => {
        receiversIds.push(
            idManager.getId(child.val())
        );
    });

    let updates = {};

    // Убираем список из пвпки создателя данного списка.
    const userSendPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.USER_SEND_DELIM,
        userId: senderId,
    });
    updates[userSendPath + shoppingListId] = null;

    // Убираем список из папок получателей этого списка.
    receiversIds.forEach(receiverId => {
        const userReceivedPath = firebasePaths.getPath({
            pathType: firebasePaths.paths.USER_RECEIVED_DELIM,
            userId: receiverId,
        });
        updates[userReceivedPath + shoppingListId] = null;
    });

    // Удаляем сам список покупок.
    const shoppingListPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_DATA,
        shoppingListId,
    });
    updates[shoppingListPath] = null;

    // Применяем обновление.
    await admin.database().ref().update(updates);

    res.json({
        status: statusTypes.SUCCESS,
    });
};
