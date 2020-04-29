const statusTypes = require('../../data/common/statusTypes');
const firebasePaths = require('../../helpers/firebase-paths/firebasePaths');
const idManager = require('../../helpers/id-manager/idManager');

exports.removeCollaboratorHandler = async ({req, res, admin}) => {
    const requestData = req.body;
    const {
        shoppingListId,
        collaborator,
    } = requestData;

    if (!shoppingListId ||
        !collaborator) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    // Путь до создателя списка.
    const listSenderPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_SENDER,
        shoppingListId
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
    let removedCollaboratorListKey = '';
    receiversData.forEach(child => {
        if (child.val() !== collaborator) {
            receiversIds.push(
                idManager.getId(child.val())
            );
        } else {
            removedCollaboratorListKey = child.key;
        }
    });
    const removedCollaboratorId = idManager.getId(collaborator);

    if (removedCollaboratorListKey.length <= 0) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    const updateTimestamp = Date.now();

    let updates = {};

    // Обновляем данные создателя спискаю
    const senderPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.USER_SEND_DELIM,
        userId: senderId,
    });
    updates[
    senderPath + shoppingListId + firebasePaths.d + firebasePaths.folderNames.UPDATE_TIMESTAMP
        ] = updateTimestamp;

    // Обновляем данные не удалённых получателей списка.
    receiversIds.forEach(id => {
        const receiverPath = firebasePaths.getPath({
            pathType: firebasePaths.paths.USER_RECEIVED_DELIM,
            userId: id,
        });
        updates[
            receiverPath + shoppingListId + firebasePaths.d + firebasePaths.folderNames.UPDATE_TIMESTAMP
            ] = updateTimestamp;
    });

    // Обновляем список покупок.
    const shoppingListPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_DELIM,
        shoppingListId,
    });
    updates[
        shoppingListPath + firebasePaths.d + firebasePaths.folderNames.UPDATE_TIMESTAMP
        ] = updateTimestamp;

    // Обновляем карточку списка покупок.
    const shoppingListCardPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_CARD_DELIM,
        shoppingListId,
    });
    updates[
        shoppingListCardPath +
        firebasePaths.d +
        firebasePaths.folderNames.UPDATE_TIMESTAMP
        ] = updateTimestamp;

    // Удаляем получателя списка.
    updates[listReceiversPath + firebasePaths.d + removedCollaboratorListKey] = null;

    // Удаляем список у соответствующего пользователя.
    const removedReceiverPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.USER_RECEIVED_DELIM,
        userId: removedCollaboratorId,
    });
    updates[removedReceiverPath + shoppingListId] = null;

    // Применяем обновление.
    await admin.database().ref().update(updates);

    res.json({
        status: statusTypes.SUCCESS,
        remainingReceiversCount: receiversIds.length,
    });
};
