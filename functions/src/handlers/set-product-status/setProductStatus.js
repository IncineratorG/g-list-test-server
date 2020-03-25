const statusTypes = require('../../data/common/statusTypes');
const firebasePaths = require('../../helpers/firebase-paths/firebasePaths');

exports.setProductStatusHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const {
        editor,
        shoppingListId,
        productId,
        status,
        completedItemsCount,
        totalItemsCount,
    } = requestData;

    if (!editor ||
        !shoppingListId ||
        !productId ||
        !status ||
        !completedItemsCount ||
        !totalItemsCount) {
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
        productId,
    });

    if (listPath.length <= 0 || listCardPath.length <= 0 || productPath <= 0) {
        console.log(
            'setProductStatusHandler->BAD_PATH_LENGTH: ' +
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
        .ref('/shared/shoppingLists/' + shoppingListId + '/sender')
        .once('value');
    const listReceiversData = await admin
        .database()
        .ref('/shared/shoppingLists/' + shoppingListId + '/receivers')
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
    updates[
    productPath +
    firebasePaths.d +
    firebasePaths.folderNames.COMPLETION_STATUS
        ] = status;
    updates[
    productPath + firebasePaths.d + firebasePaths.folderNames.UPDATE_TIMESTAMP
        ] = updateTimestamp;

    listSenders.forEach(senderPhone => {
        updates['/users/' + senderPhone + '/send/' + shoppingListId + '/updateTimestamp'] = updateTimestamp;
    });
    listReceivers.forEach(receiverPhone => {
        updates['/users/' + receiverPhone + '/received/' + shoppingListId + '/updateTimestamp'] = updateTimestamp;
    });

    await admin.database().ref().update(updates);

    res.json({
        status: statusTypes.SUCCESS,
    });
};
