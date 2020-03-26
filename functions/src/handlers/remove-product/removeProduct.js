const statusTypes = require('../../data/common/statusTypes');
const firebasePaths = require('../../helpers/firebase-paths/firebasePaths');

exports.removeProductHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const {
        editor,
        shoppingListId,
        productId,
        completedItemsCount,
        totalItemsCount,
    } = requestData;

    if (!editor ||
        !shoppingListId ||
        !productId) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    // Получаем пути в firebase до списка покупок
    const listPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST,
        shoppingListId,
    });
    const listCardPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_CARD,
        shoppingListId,
    });
    const productPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.PRODUCT,
        shoppingListId,
        productId: productId,
    });
    const listSenderPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_SENDER,
        shoppingListId,
    });
    const listReceiversPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_RECEIVERS,
        shoppingListId,
    });

    if (listPath.length <= 0 || listCardPath.length <= 0 || productPath <= 0) {
        console.log(
            'removeProductHandler->BAD_PATH_LENGTH: ' +
            listPath.length + '-' +
            listCardPath.length + '-' +
            productPath.length
        );
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    const listSenderData = await admin
        .database()
        .ref(listSenderPath)
        .once('value');
    const listReceiversData = await admin
        .database()
        .ref(listReceiversPath)
        .once('value');

    const listSenders = [];
    const listReceivers = [];

    if (listSenderData.val() !== editor) {
        listSenders.push(listSenderData.val());
    }
    listReceiversData.forEach(child => {
        if (child.val() !== editor) {
            listReceivers.push(child.val());
        }
    });

    const updateTimestamp = Date.now();

    // Обновляем данные по соответвующим путям.
    const updates = {};
    updates[
    listPath +
    firebasePaths.d +
    firebasePaths.folderNames.COMPLETED_ITEMS_COUNT
        ] = completedItemsCount;
    updates[
    listPath + firebasePaths.d + firebasePaths.folderNames.TOTAL_ITEMS_COUNT
        ] = totalItemsCount;
    updates[
    listPath + firebasePaths.d + firebasePaths.folderNames.UPDATE_TIMESTAMP
        ] = updateTimestamp;

    updates[
    listCardPath +
    firebasePaths.d +
    firebasePaths.folderNames.COMPLETED_ITEMS_COUNT
        ] = completedItemsCount;
    updates[
    listCardPath +
    firebasePaths.d +
    firebasePaths.folderNames.TOTAL_ITEMS_COUNT
        ] = totalItemsCount;
    updates[
    listCardPath +
    firebasePaths.d +
    firebasePaths.folderNames.UPDATE_TIMESTAMP
        ] = updateTimestamp;

    updates[productPath] = null;

    listSenders.forEach(senderPhone => {
        const userSendPath = firebasePaths.getPath({
            pathType: firebasePaths.paths.USER_SEND_DELIM,
            userId: senderPhone,
        });
        updates[
            userSendPath +
            shoppingListId +
            firebasePaths.d +
            firebasePaths.folderNames.UPDATE_TIMESTAMP
            ] = updateTimestamp;
    });
    listReceivers.forEach(receiverPhone => {
        const userReceivedPath = firebasePaths.getPath({
            pathType: firebasePaths.paths.USER_RECEIVED_DELIM,
            userId: receiverPhone,
        });
        updates[
            userReceivedPath +
            shoppingListId +
            firebasePaths.d +
            firebasePaths.folderNames.UPDATE_TIMESTAMP
            ] = updateTimestamp;
    });

    await admin.database().ref().update(updates);

    res.json({
        status: statusTypes.SUCCESS,
    });
};
